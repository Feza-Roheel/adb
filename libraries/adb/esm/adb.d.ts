import { AdbCredentialStore } from './auth.js';
import { AdbPower, AdbReverseCommand, AdbSubprocess, AdbSync, AdbTcpIpCommand, AdbFrameBuffer } from './commands/index.js';
import { AdbFeatures } from './features.js';
import { AdbPacketData, AdbPacketInit } from './packet.js';
import { AdbIncomingSocketHandler, AdbSocket, Closeable } from './socket/index.js';
import { WritableStream, ReadableWritablePair } from "./stream/index.js";
export declare enum AdbPropKey {
    Product = "ro.product.name",
    Model = "ro.product.model",
    Device = "ro.product.device",
    Features = "features"
}
export declare const VERSION_OMIT_CHECKSUM = 16777217;
export declare class Adb implements Closeable {
    /**
     * It's possible to call `authenticate` multiple times on a single connection,
     * every time the device receives a `CNXN` packet, it resets its internal state,
     * and starts a new authentication process.
     */
    static authenticate(connection: ReadableWritablePair<AdbPacketData, AdbPacketInit>, credentialStore: AdbCredentialStore, authenticators?: import("./auth.js").AdbAuthenticator[]): Promise<Adb>;
    private readonly dispatcher;
    get disconnected(): Promise<void>;
    private _protocolVersion;
    get protocolVersion(): number | undefined;
    private _product;
    get product(): string | undefined;
    private _model;
    get model(): string | undefined;
    private _device;
    get device(): string | undefined;
    private _features;
    get features(): AdbFeatures[] | undefined;
    readonly subprocess: AdbSubprocess;
    readonly power: AdbPower;
    readonly reverse: AdbReverseCommand;
    readonly tcpip: AdbTcpIpCommand;
    constructor(connection: ReadableWritablePair<AdbPacketData, AdbPacketInit>, version: number, maxPayloadSize: number, banner: string);
    private parseBanner;
    addIncomingSocketHandler(handler: AdbIncomingSocketHandler): import("@yume-chan/event").RemoveEventListener;
    createSocket(service: string): Promise<AdbSocket>;
    createSocketAndWait(service: string): Promise<string>;
    getProp(key: string): Promise<string>;
    rm(...filenames: string[]): Promise<string>;
    install(): WritableStream<Uint8Array>;
    sync(): Promise<AdbSync>;
    framebuffer(): Promise<AdbFrameBuffer>;
    /**
     * Close the ADB connection.
     *
     * Note that it won't close the streams from backends.
     * The streams are both physically and logically intact,
     * and can be reused.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=adb.d.ts.map