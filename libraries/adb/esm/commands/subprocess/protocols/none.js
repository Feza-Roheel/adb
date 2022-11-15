import { DuplexStreamFactory, ReadableStream } from "../../../stream/index.js";
/**
 * The legacy shell
 *
 * Features:
 * * `stderr`: No
 * * `exit` exit code: No
 * * `resize`: No
 */
export class AdbSubprocessNoneProtocol {
    static isSupported() { return true; }
    static async pty(adb, command) {
        return new AdbSubprocessNoneProtocol(await adb.createSocket(`shell:${command}`));
    }
    static async raw(adb, command) {
        // `shell,raw:${command}` also triggers raw mode,
        // But is not supported before Android 7.
        return new AdbSubprocessNoneProtocol(await adb.createSocket(`exec:${command}`));
    }
    socket;
    duplex;
    // Legacy shell forwards all data to stdin.
    get stdin() { return this.socket.writable; }
    _stdout;
    /**
     * Legacy shell mixes stdout and stderr.
     */
    get stdout() { return this._stdout; }
    _stderr;
    /**
     * `stderr` will always be empty.
     */
    get stderr() { return this._stderr; }
    _exit;
    get exit() { return this._exit; }
    constructor(socket) {
        this.socket = socket;
        this.duplex = new DuplexStreamFactory({
            close: async () => {
                await this.socket.close();
            },
        });
        this._stdout = this.duplex.wrapReadable(this.socket.readable);
        this._stderr = this.duplex.wrapReadable(new ReadableStream());
        this._exit = this.duplex.closed.then(() => 0);
    }
    resize() {
        // Not supported
    }
    kill() {
        return this.duplex.close();
    }
}
//# sourceMappingURL=none.js.map