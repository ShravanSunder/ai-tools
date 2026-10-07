export const sandboxPreflightMessage = (
  environment: Readonly<Record<string, string | undefined>>,
): string | undefined => {
  const value = environment.CODEX_SANDBOX;
  return value
    ? `skill-eval-runner run/done-bar requires an unsandboxed shell; CODEX_SANDBOX=${value} is set. Run from a normal shell.`
    : undefined;
};
