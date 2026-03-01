export function normalizeHostname(rawHostname: string): string {
	return rawHostname.trim().toLowerCase().replace(/\.+$/u, '');
}
