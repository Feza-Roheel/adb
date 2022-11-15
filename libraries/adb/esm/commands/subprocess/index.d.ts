import { Adb } from '../../adb.js';
import {AdbSubprocessProtocol,AdbSubprocessProtocolConstructor } from './protocols/index.js';
export * from './protocols/index.js';
export * from './utils.js';
export interface AdbSubprocessOptions {
    /**
     * A list of `AdbSubprocessProtocolConstructor`s to be used.
     *
     * Different `AdbSubprocessProtocol` has different capabilities, thus requires specific adaptations.
     * Check their documentations for details.
     *
     * The first protocol whose `isSupported` returns `true` will be used.
     * If no `AdbSubprocessProtocol` is supported, an error will be thrown.
     *
     * @default [AdbSubprocessShellProtocol, AdbSubprocessNoneProtocol]
     */
    protocols: AdbSubprocessProtocolConstructor[];
}
export interface AdbSubprocessWaitResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}
export declare class AdbSubprocess {
    readonly adb: Adb;
    constructor(adb: Adb);
    private createProtocol;
    /**
     * Spawns an executable in PTY (interactive) mode.
     * @param command The command to run. If omitted, the default shell will be spawned.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    shell(command?: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessProtocol>;
    /**
     * Spawns an executable and pipe the output.
     * @param command The command to run, or an array of strings containing both command and args.
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns A new `AdbSubprocessProtocol` instance connecting to the spawned process.
     */
    spawn(command: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessProtocol>;
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @param options The options for creating the `AdbSubprocessProtocol`
     * @returns The entire output of the command
     */
    spawnAndWait(command: string | string[], options?: Partial<AdbSubprocessOptions>): Promise<AdbSubprocessWaitResult>;
    /**
     * Spawns a new process, waits until it exits, and returns the entire output.
     * @param command The command to run
     * @returns The entire output of the command
     */
    spawnAndWaitLegacy(command: string | string[]): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map