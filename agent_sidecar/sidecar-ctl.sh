#!/bin/bash
# =============================================================================
# sidecar-ctl.sh - Host-side control script for AI Coder Sidecar
# =============================================================================
# Manages firewall allowlists and container state from the host machine.
# The agent inside the container CANNOT modify firewall rules directly.
#
# SAFETY FEATURES:
#   - Refuses to run as root (prevents accidental host damage)
#   - Refuses to run inside containers (host-only script)
#   - Validates all file paths before writing (whitelist of allowed filenames)
#   - Validates container names match expected sidecar patterns
#   - Only writes to firewall-allowlist-toggle*.txt files
#   - Only executes hardcoded firewall.sh inside containers
#   - No shell injection possible (all paths validated, no eval)
#
# Usage:
#   sidecar-ctl.sh firewall reload                     # Reload all allowlists
#   sidecar-ctl.sh firewall allow <preset|domain>      # Add preset or domain
#   sidecar-ctl.sh firewall block <preset|domain>      # Remove preset or domain
#   sidecar-ctl.sh firewall allow-for <time> <preset|domain>  # Temporary access
#   sidecar-ctl.sh firewall toggle [time]              # Quick! ALL presets (default: 10m)
#   sidecar-ctl.sh firewall clear                      # Clear all toggle domains
#   sidecar-ctl.sh firewall list                       # List current toggle domains
#   sidecar-ctl.sh firewall presets                    # List available presets
#   sidecar-ctl.sh status                              # Show container + firewall status
#   sidecar-ctl.sh containers                          # List all sidecar containers
# =============================================================================

set -euo pipefail

# =============================================================================
# SAFETY CHECKS - Prevent accidental host damage
# =============================================================================

# 1. Never run as root on the host
if [[ $EUID -eq 0 ]]; then
    echo "ERROR: Do not run this script as root on the host." >&2
    echo "This script modifies allowlist files and runs docker commands." >&2
    echo "Run as your normal user instead." >&2
    exit 1
fi

# 2. Verify we're not inside a container (this is a HOST-side script)
if [[ -f /.dockerenv ]] || grep -q docker /proc/1/cgroup 2>/dev/null; then
    echo "ERROR: This script must run on the HOST, not inside a container." >&2
    exit 1
fi

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIDECAR_DIR="$SCRIPT_DIR"
PRESETS_DIR="$SIDECAR_DIR/firewall-toggle-presets"

# Allowed file patterns for toggle allowlist (safety whitelist)
ALLOWED_TOGGLE_PATTERNS=(
    "firewall-allowlist-toggle.tmp.txt"
    "firewall-allowlist-toggle.base.txt"
    "firewall-allowlist-toggle.txt"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- Helper Functions ---
log_info() { echo -e "${BLUE}ℹ${NC} $1"; }
log_success() { echo -e "${GREEN}✓${NC} $1"; }
log_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
log_error() { echo -e "${RED}✗${NC} $1" >&2; }

# Parse duration string (e.g., 15m, 1h, 30s) to seconds
parse_duration() {
    local duration="$1"
    if [[ "$duration" =~ ^([0-9]+)m$ ]]; then
        echo $((${BASH_REMATCH[1]} * 60))
    elif [[ "$duration" =~ ^([0-9]+)h$ ]]; then
        echo $((${BASH_REMATCH[1]} * 3600))
    elif [[ "$duration" =~ ^([0-9]+)s$ ]]; then
        echo ${BASH_REMATCH[1]}
    else
        echo ""
    fi
}

# Validate container name matches expected sidecar patterns
validate_container_name() {
    local container="$1"
    
    # Must match known sidecar naming patterns
    if [[ "$container" =~ ^agent-sidecar-[a-z0-9-]+-[a-f0-9]{8}$ ]] || \
       [[ "$container" =~ ^voyager-sidecar-[a-f0-9]{8}$ ]]; then
        return 0
    fi
    
    log_error "SAFETY: Container name doesn't match expected sidecar patterns: $container"
    exit 1
}

# Find sidecar container for current directory
find_container() {
    local work_dir
    work_dir=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
    local dir_hash
    dir_hash=$(echo -n "$work_dir" | md5 -q 2>/dev/null || echo -n "$work_dir" | md5sum | cut -c1-8)
    dir_hash="${dir_hash:0:8}"
    
    local repo_name
    repo_name=$(basename "$work_dir" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
    
    # Try both naming patterns
    local container=""
    for pattern in "agent-sidecar-${repo_name}-${dir_hash}"; do
        if docker ps -q -f "name=^${pattern}$" 2>/dev/null | grep -q .; then
            container="$pattern"
            break
        fi
    done
    
    # Validate container name if found
    if [[ -n "$container" ]]; then
        validate_container_name "$container"
    fi
    
    echo "$container"
}

# Validate that a file path is safe for writing (toggle allowlist only)
validate_toggle_file() {
    local file_path="$1"
    local basename
    basename=$(basename "$file_path")
    
    # Must match allowed patterns
    local valid=false
    for pattern in "${ALLOWED_TOGGLE_PATTERNS[@]}"; do
        if [[ "$basename" == "$pattern" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" != true ]]; then
        log_error "SAFETY: Refusing to write to unexpected file: $file_path"
        log_error "Expected filename: ${ALLOWED_TOGGLE_PATTERNS[*]}"
        exit 1
    fi
    
    # Must not contain path traversal
    if [[ "$file_path" == *".."* ]]; then
        log_error "SAFETY: Path traversal detected in: $file_path"
        exit 1
    fi
    
    # Must be under a known safe directory (sidecar dir or .agent_sidecar)
    local real_path
    real_path=$(realpath -m "$file_path" 2>/dev/null || echo "$file_path")
    
    if [[ "$real_path" != "$SIDECAR_DIR/"* ]] && [[ "$real_path" != *"/.agent_sidecar/"* ]] && [[ "$real_path" != *"/agent_sidecar/"* ]]; then
        log_error "SAFETY: File path not in allowed directory: $file_path"
        log_error "Must be under sidecar dir or .agent_sidecar"
        exit 1
    fi
    
    return 0
}

# Get toggle allowlist path for a container (returns .tmp.txt for runtime changes)
get_toggle_allowlist() {
    local container="$1"
    local toggle_file=""
    
    # Get the SCRIPT_DIR from container env
    local script_dir
    script_dir=$(docker inspect "$container" --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^SCRIPT_DIR=' | cut -d= -f2)
    
    # Determine the base directory for toggle file (in .generated/)
    if [[ -n "$script_dir" && -d "$script_dir" ]]; then
        mkdir -p "$script_dir/.generated"
        toggle_file="$script_dir/.generated/firewall-allowlist-toggle.tmp.txt"
    else
        # Try to find it in the workspace
        local work_dir
        work_dir=$(docker inspect "$container" --format '{{.Config.WorkingDir}}')
        if [[ -d "$work_dir/.agent_sidecar" ]]; then
            mkdir -p "$work_dir/.agent_sidecar/.generated"
            toggle_file="$work_dir/.agent_sidecar/.generated/firewall-allowlist-toggle.tmp.txt"
        else
            mkdir -p "$SIDECAR_DIR/.generated"
            toggle_file="$SIDECAR_DIR/.generated/firewall-allowlist-toggle.tmp.txt"
        fi
    fi
    
    # Validate the path before returning
    validate_toggle_file "$toggle_file"
    
    echo "$toggle_file"
}

# --- Firewall Commands ---
cmd_firewall_reload() {
    local container
    container=$(find_container)
    
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    log_info "Reloading firewall in container: $container"
    docker exec -u root "$container" /usr/local/bin/firewall.sh --reload
    log_success "Firewall reloaded"
}

cmd_firewall_allow() {
    local input="$1"
    local skip_reload="${2:-false}"  # Optional: skip reload for batching
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    # Check if input is a domain (contains a dot) or a preset name
    if [[ "$input" == *.* ]]; then
        # It's a domain - add directly
        log_info "Adding domain '$input' to: $toggle_file"
        if ! grep -qxF "$input" "$toggle_file" 2>/dev/null; then
            echo "$input" >> "$toggle_file"
            log_success "Added: $input"
        else
            log_warn "Already present: $input"
        fi
    else
        # It's a preset name
        local preset_file="$PRESETS_DIR/${input}.txt"
        if [[ ! -f "$preset_file" ]]; then
            log_error "Preset not found: $input"
            log_info "Available presets:"
            cmd_firewall_presets
            log_info ""
            log_info "Or add a domain directly: firewall allow example.com"
            exit 1
        fi
        
        log_info "Adding preset '$input' to: $toggle_file"
        
        # Add domains from preset (skip if already present)
        while IFS= read -r line || [[ -n "$line" ]]; do
            line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            [[ -z "$line" || "$line" == "#"* ]] && continue
            
            if ! grep -qxF "$line" "$toggle_file" 2>/dev/null; then
                echo "$line" >> "$toggle_file"
                log_info "  Added: $line"
            else
                log_warn "  Already present: $line"
            fi
        done < "$preset_file"
    fi
    
    # Reload firewall (unless batching)
    if [[ "$skip_reload" != "true" ]]; then
        cmd_firewall_reload
    fi
}

cmd_firewall_block() {
    local input="$1"
    local skip_reload="${2:-false}"  # Optional: skip reload for batching
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    # Check if input is a domain (contains a dot) or a preset name
    if [[ "$input" == *.* ]]; then
        # It's a domain - remove directly
        log_info "Removing domain '$input' from: $toggle_file"
        if grep -qxF "$input" "$toggle_file" 2>/dev/null; then
            grep -vxF "$input" "$toggle_file" > "$toggle_file.tmp" && mv "$toggle_file.tmp" "$toggle_file"
            log_success "Removed: $input"
        else
            log_warn "Not found: $input"
        fi
    else
        # It's a preset name
        local preset_file="$PRESETS_DIR/${input}.txt"
        if [[ ! -f "$preset_file" ]]; then
            log_error "Preset not found: $input"
            log_info "Or remove a domain directly: firewall block example.com"
            exit 1
        fi
        
        log_info "Removing preset '$input' from: $toggle_file"
        
        # Remove domains from preset
        local temp_file
        temp_file=$(mktemp)
        
        while IFS= read -r toggle_line || [[ -n "$toggle_line" ]]; do
            local should_remove=false
            while IFS= read -r preset_line || [[ -n "$preset_line" ]]; do
                preset_line=$(echo "$preset_line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
                [[ -z "$preset_line" || "$preset_line" == "#"* ]] && continue
                if [[ "$toggle_line" == "$preset_line" ]]; then
                    should_remove=true
                    log_info "  Removed: $toggle_line"
                    break
                fi
            done < "$preset_file"
            
            if [[ "$should_remove" == false ]]; then
                echo "$toggle_line" >> "$temp_file"
            fi
        done < "$toggle_file"
        
        mv "$temp_file" "$toggle_file"
    fi
    
    # Reload firewall (unless batching)
    if [[ "$skip_reload" != "true" ]]; then
        cmd_firewall_reload
    fi
}

cmd_firewall_allow_for() {
    local duration="$1"
    local preset="$2"
    
    local seconds
    seconds=$(parse_duration "$duration")
    if [[ -z "$seconds" ]]; then
        log_error "Invalid duration format. Use: 15m, 1h, 30s"
        exit 1
    fi
    
    log_info "Allowing '$preset' for $duration ($seconds seconds)"
    
    # Allow the preset
    cmd_firewall_allow "$preset"
    
    # Schedule removal in background
    (
        sleep "$seconds"
        log_info "Time expired. Removing '$preset'..."
        cmd_firewall_block "$preset"
    ) &
    
    local bg_pid=$!
    log_success "Access granted. Will auto-revoke in $duration (background PID: $bg_pid)"
    log_info "To cancel: kill $bg_pid"
}

cmd_firewall_allow_all_for() {
    local duration="${1:-10m}"  # Default to 10 minutes
    
    local seconds
    seconds=$(parse_duration "$duration")
    if [[ -z "$seconds" ]]; then
        log_error "Invalid duration format. Use: 15m, 1h, 30s"
        exit 1
    fi
    
    log_info "Allowing ALL presets for $duration ($seconds seconds)"
    
    # Get list of all presets
    local presets=()
    if [[ -d "$PRESETS_DIR" ]]; then
        for preset_file in "$PRESETS_DIR"/*.txt; do
            [[ -f "$preset_file" ]] || continue
            presets+=("$(basename "$preset_file" .txt)")
        done
    fi
    
    if [[ ${#presets[@]} -eq 0 ]]; then
        log_error "No presets found in $PRESETS_DIR"
        exit 1
    fi
    
    # Allow all presets (batched - skip individual reloads)
    for preset in "${presets[@]}"; do
        log_info "Enabling preset: $preset"
        cmd_firewall_allow "$preset" "true" 2>/dev/null || true
    done
    
    # Single reload after all presets added
    cmd_firewall_reload
    
    # Schedule removal in background
    (
        sleep "$seconds"
        log_info "Time expired. Removing all presets..."
        for preset in "${presets[@]}"; do
            cmd_firewall_block "$preset" "true" 2>/dev/null || true
        done
        # Single reload after all presets removed
        cmd_firewall_reload
    ) &
    
    local bg_pid=$!
    log_success "All presets enabled. Will auto-revoke in $duration (background PID: $bg_pid)"
    log_info "To cancel: kill $bg_pid"
}

cmd_firewall_clear() {
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    log_info "Clearing all toggle domains from: $toggle_file"
    
    # Keep header comments, remove all domain entries
    local temp_file
    temp_file=$(mktemp)
    grep '^#' "$toggle_file" > "$temp_file" 2>/dev/null || true
    mv "$temp_file" "$toggle_file"
    
    # Reload firewall
    cmd_firewall_reload
    log_success "Toggle allowlist cleared"
}

cmd_firewall_list() {
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    echo "Toggle allowlist: $toggle_file"
    echo "---"
    if [[ -f "$toggle_file" ]]; then
        grep -v '^#' "$toggle_file" | grep -v '^$' || echo "(empty)"
    else
        echo "(file not found)"
    fi
}

cmd_firewall_presets() {
    echo "Available firewall presets:"
    echo "---"
    if [[ -d "$PRESETS_DIR" ]]; then
        for preset in "$PRESETS_DIR"/*.txt; do
            [[ -f "$preset" ]] || continue
            local name
            name=$(basename "$preset" .txt)
            local count
            count=$(grep -cv '^#\|^$' "$preset" 2>/dev/null || echo "0")
            echo "  $name ($count domains)"
        done
    else
        echo "(no presets directory found)"
    fi
}

# --- Status Commands ---
cmd_status() {
    local container
    container=$(find_container)
    
    echo "=== Agent Sidecar Status ==="
    echo ""
    
    if [[ -z "$container" ]]; then
        log_warn "No sidecar container found for current directory"
        echo ""
        echo "Run: agent-sidecar-router.sh"
        return
    fi
    
    echo "Container: $container"
    echo "Status: $(docker inspect "$container" --format '{{.State.Status}}')"
    echo "Started: $(docker inspect "$container" --format '{{.State.StartedAt}}')"
    echo ""
    
    echo "--- Firewall Status ---"
    docker exec "$container" sh -c 'ipset list aidev_allowed_v4 2>/dev/null | head -5' || echo "(ipset not available)"
    echo ""
    
    echo "--- Toggle Allowlist ---"
    cmd_firewall_list
}

cmd_containers() {
    echo "=== All Sidecar Containers ==="
    docker ps -a --filter "name=agent-sidecar" \
        --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# --- Main ---
show_usage() {
    cat <<EOF
Usage: $(basename "$0") <command> [args]

Firewall Commands:
  firewall reload                     Reload all allowlists
  firewall allow <preset|domain>      Add preset or domain to toggle list
  firewall block <preset|domain>      Remove preset or domain from toggle list
  firewall allow-for <time> <preset|domain>  Temporary access (e.g., 15m, 1h)
  firewall toggle [time]              Quick: allow ALL presets (default: 10m)
  firewall allow-all-for [time]       Same as toggle
  firewall clear                      Clear all toggle domains
  firewall list                       List current toggle domains
  firewall presets                    List available presets

Status Commands:
  status                              Show container + firewall status
  containers                          List all sidecar containers

Examples:
  $(basename "$0") firewall allow jira              # Add preset
  $(basename "$0") firewall allow api.example.com   # Add single domain
  $(basename "$0") firewall allow-for 15m notion    # Preset for 15 min
  $(basename "$0") firewall allow-for 30m foo.com   # Domain for 30 min
  $(basename "$0") firewall toggle                   # Quick! All presets for 10 min
  $(basename "$0") firewall toggle 15m              # All presets for 15 min
  $(basename "$0") firewall block jira
  $(basename "$0") firewall block api.example.com
  $(basename "$0") firewall clear
  $(basename "$0") status
EOF
}

case "${1:-}" in
    firewall)
        case "${2:-}" in
            reload)
                cmd_firewall_reload
                ;;
            allow)
                [[ -z "${3:-}" ]] && { log_error "Missing preset name"; exit 1; }
                cmd_firewall_allow "$3"
                ;;
            block)
                [[ -z "${3:-}" ]] && { log_error "Missing preset name"; exit 1; }
                cmd_firewall_block "$3"
                ;;
            allow-for)
                [[ -z "${3:-}" || -z "${4:-}" ]] && { log_error "Usage: firewall allow-for <duration> <preset>"; exit 1; }
                cmd_firewall_allow_for "$3" "$4"
                ;;
            allow-all-for|toggle)
                cmd_firewall_allow_all_for "${3:-}"  # Defaults to 10m if not provided
                ;;
            clear)
                cmd_firewall_clear
                ;;
            list)
                cmd_firewall_list
                ;;
            presets)
                cmd_firewall_presets
                ;;
            *)
                log_error "Unknown firewall command: ${2:-}"
                show_usage
                exit 1
                ;;
        esac
        ;;
    status)
        cmd_status
        ;;
    containers)
        cmd_containers
        ;;
    --help|-h|"")
        show_usage
        ;;
    *)
        log_error "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
