import type { Duplex } from "node:stream";

export interface GuestLoopbackStreamOpener {
  openGuestLoopbackStream(input: {
    host?: "127.0.0.1" | "localhost";
    port: number;
    timeoutMs?: number;
  }): Promise<Duplex>;
}

/**
 * Implement this adapter in your local Gondolin integration layer.
 *
 * Why this file exists:
 * - The Gondolin security docs describe SandboxServer.openTcpStream() as a
 *   host <-> guest control API for guest loopback services.
 * - The public VM docs do not currently document a vm.openTcpStream() method.
 *
 * Therefore the project should pin a Gondolin revision and expose a stable
 * wrapper in one place instead of relying on ad hoc internal property names.
 */
export class TODOImplementPinnedGondolinOpener implements GuestLoopbackStreamOpener {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly pinnedGondolinHandle: any) {}

  async openGuestLoopbackStream(input: {
    host?: "127.0.0.1" | "localhost";
    port: number;
    timeoutMs?: number;
  }): Promise<Duplex> {
    throw new Error(
      "TODO: wire this adapter to the pinned Gondolin SandboxServer.openTcpStream() capability in your local integration layer"
    );
  }
}
