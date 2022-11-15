import { AutoDisposable } from '@yume-chan/event';
import { Adb } from "../adb.js";
import { AdbIncomingSocketHandler, AdbSocket } from '../socket/index.js';
export interface AdbForwardListener {
    deviceSerial: string;
    localName: string;
    remoteName: string;
}
export declare class AdbReverseCommand extends AutoDisposable {
    protected localAddressToHandler: Map<string, AdbIncomingSocketHandler>;
    protected deviceAddressToLocalAddress: Map<string, string>;
    protected adb: Adb;
    protected listening: boolean;
    constructor(adb: Adb);
    protected handleIncomingSocket: (socket: AdbSocket) => Promise<boolean>;
    private createBufferedStream;
    private sendRequest;
    list(): Promise<AdbForwardListener[]>;
    /**
     * @param deviceAddress The address adbd on device is listening on. Can be `tcp:0` to let adbd choose an available TCP port by itself.
     * @param localAddress Native ADB client will open a connection to this address when reverse connection received. In WebADB, it's only used to uniquely identify a reverse tunnel registry, `handler` will be called to handle the connection.
     * @param handler A callback to handle incoming connections
     * @returns If `deviceAddress` is `tcp:0`, return `tcp:{ACTUAL_LISTENING_PORT}`; otherwise, return `deviceAddress`.
     */
    add(deviceAddress: string, localAddress: string, handler: AdbIncomingSocketHandler): Promise<string>;
    remove(deviceAddress: string): Promise<void>;
    removeAll(): Promise<void>;
}
//# sourceMappingURL=reverse.d.ts.map