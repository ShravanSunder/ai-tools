#!/bin/bash
# =============================================================================
# sidecar-ctl.sh - Host-side control script for AI Coder Sidecar
# =============================================================================
# Manages firewall allowlists and container state from the host machine.
# The agent inside the container CANNOT modify firewall rules directly.
#
# Usage:
#   sidecar-ctl.sh firewall reload              # Reload all allowlists
#   sidecar-ctl.sh firewall allow <preset>      # Add preset domains to toggle list
#   sidecar-ctl.sh firewall block <preset>      # Remove preset domains from toggle list
#   sidecar-ctl.sh firewall allow-for <time> <preset>  # Temporary access for preset
#   sidecar-ctl.sh firewall allow-all-for <time>       # Temporary access for ALL presets
#   sidecar-ctl.sh firewall clear               # Clear all toggle domains
#   sidecar-ctl.sh firewall list                # List current toggle domains
#   sidecar-ctl.sh firewall presets             # List available presets
#   sidecar-ctl.sh status                       # Show container + firewall status
#   sidecar-ctl.sh containers                   # List all sidecar containers
# =============================================================================

set -euo pipefail

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIDECAR_DIR="$(dirname "$SCRIPT_DIR")"
PRESETS_DIR="$SIDECAR_DIR/firewall-presets"

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
    for pattern in "ai-coder-sidecar-${repo_name}-${dir_hash}" "voyager-sidecar-${dir_hash}"; do
        if docker ps -q -f "name=^${pattern}$" 2>/dev/null | grep -q .; then
            container="$pattern"
            break
        fi
    done
    
    echo "$container"
}

# Get toggle allowlist path for a container
get_toggle_allowlist() {
    local container="$1"
    
    # Get the SCRIPT_DIR from container env
    local script_dir
    script_dir=$(docker inspect "$container" --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^SCRIPT_DIR=' | cut -d= -f2)
    
    if [[ -n "$script_dir" && -f "$script_dir/firewall-allowlist-toggle.base.txt" ]]; then
        echo "$script_dir/firewall-allowlist-toggle.base.txt"
    else
        # Try to find it in the workspace
        local work_dir
        work_dir=$(docker inspect "$container" --format '{{.Config.WorkingDir}}')
        if [[ -f "$work_dir/.devcontainer/firewall-allowlist-toggle.base.txt" ]]; then
            echo "$work_dir/.devcontainer/firewall-allowlist-toggle.base.txt"
        else
            echo "$SIDECAR_DIR/firewall-allowlist-toggle.base.txt"
        fi
    fi
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
    local preset="$1"
    local preset_file="$PRESETS_DIR/${preset}.txt"
    
    if [[ ! -f "$preset_file" ]]; then
        log_error "Preset not found: $preset"
        log_info "Available presets:"
        cmd_firewall_presets
        exit 1
    fi
    
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    log_info "Adding preset '$preset' to: $toggle_file"
    
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
    
    # Reload firewall
    cmd_firewall_reload
}

cmd_firewall_block() {
    local preset="$1"
    local preset_file="$PRESETS_DIR/${preset}.txt"
    
    if [[ ! -f "$preset_file" ]]; then
        log_error "Preset not found: $preset"
        exit 1
    fi
    
    local container
    container=$(find_container)
    if [[ -z "$container" ]]; then
        log_error "No sidecar container found for current directory"
        exit 1
    fi
    
    local toggle_file
    toggle_file=$(get_toggle_allowlist "$container")
    
    log_info "Removing preset '$preset' from: $toggle_file"
    
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
    
    # Reload firewall
    cmd_firewall_reload
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
    local duration="$1"
    
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
    
    # Allow all presets
    for preset in "${presets[@]}"; do
        log_info "Enabling preset: $preset"
        cmd_firewall_allow "$preset" 2>/dev/null || true
    done
    
    # Schedule removal in background
    (
        sleep "$seconds"
        log_info "Time expired. Removing all presets..."
        for preset in "${presets[@]}"; do
            cmd_firewall_block "$preset" 2>/dev/null || true
        done
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
    
    echo "=== AI Coder Sidecar Status ==="
    echo ""
    
    if [[ -z "$container" ]]; then
        log_warn "No sidecar container found for current directory"
        echo ""
        echo "Run: ai-coder-sidecar-router.sh"
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
    docker ps -a --filter "name=ai-coder-sidecar" --filter "name=voyager-sidecar" \
        --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# --- Main ---
show_usage() {
    cat <<EOF
Usage: $(basename "$0") <command> [args]

Firewall Commands:
  firewall reload                     Reload all allowlists
  firewall allow <preset>             Add preset domains to toggle list
  firewall block <preset>             Remove preset domains from toggle list
  firewall allow-for <time> <preset>  Temporary access for preset (e.g., 15m, 1h)
  firewall allow-all-for <time>       Temporary access for ALL presets
  firewall clear                      Clear all toggle domains
  firewall list                       List current toggle domains
  firewall presets                    List available presets

Status Commands:
  status                              Show container + firewall status
  containers                          List all sidecar containers

Examples:
  $(basename "$0") firewall allow jira
  $(basename "$0") firewall allow-for 15m notion
  $(basename "$0") firewall allow-all-for 15m    # Quick: allow everything for 15 min
  $(basename "$0") firewall block jira
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
            allow-all-for)
                [[ -z "${3:-}" ]] && { log_error "Usage: firewall allow-all-for <duration>"; exit 1; }
                cmd_firewall_allow_all_for "$3"
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
