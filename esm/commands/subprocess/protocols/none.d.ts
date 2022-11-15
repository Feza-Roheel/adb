import { Adb } from "../../../adb.js";
import { AdbSocket } from "../../../socket/index.js";
import { ReadableStream } from "../../../stream/index.js";
import { AdbSubprocessProtocol } from "./types.js";
/**
 * The legacy shell
 *
 * Features:
 * * `stderr`: No
 * * `exit` exit code: No
 * * `resize`: No
 */
export declare class AdbSubprocessNoneProtocol implements AdbSubprocessProtocol {
    static isSupported(): boolean;
    static pty(adb: Adb, command: string): Promise<AdbSubprocessNoneProtocol>;
    static raw(adb: Adb, command: string): Promise<AdbSubprocessNoneProtocol>;
    private readonly socket;
    private readonly duplex;
    get stdin(): import("web-streams-polyfill").WritableStream<Uint8Array>;
    private _stdout;
    /**
     * Legacy shell mixes stdout and stderr.
     */
    get stdout(): ReadableStream<Uint8Array>;
    private _stderr;
    /**
     * `stderr` will always be empty.
     */
    get stderr(): ReadableStream<Uint8Array>;
    private _exit;
    get exit(): Promise<number>;
    constructor(socket: AdbSocket);
    resize(): void;
    kill(): Promise<void>;
}
//# sourceMappingURL=none.d.ts.map