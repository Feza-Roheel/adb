import { StructAsyncDeserializeStream } from '@yume-chan/struct';
import { AdbSocket, AdbSocketInfo } from '../socket/index.js';
import { ReadableStream, ReadableStreamDefaultReader } from './detect.js';
export declare class BufferedStreamEndedError extends Error {
    constructor();
}
export declare class BufferedStream {
    private buffered;
    private bufferedOffset;
    private bufferedLength;
    protected readonly stream: ReadableStream<Uint8Array>;
    protected readonly reader: ReadableStreamDefaultReader<Uint8Array>;
    constructor(stream: ReadableStream<Uint8Array>);
    private readSource;
    private readAsync;
    /**
     *
     * @param length
     * @returns
     */
    read(length: number): Uint8Array | Promise<Uint8Array>;
    /**
     * Return a readable stream with unconsumed data (if any) and
     * all data from the wrapped stream.
     * @returns A `ReadableStream`
     */
    release(): ReadableStream<Uint8Array>;
    close(): Promise<void>;
}
export declare class AdbBufferedStream extends BufferedStream implements AdbSocketInfo, StructAsyncDeserializeStream {
    protected readonly socket: AdbSocket;
    get localId(): number;
    get remoteId(): number;
    get localCreated(): boolean;
    get serviceString(): string;
    get writable(): import("web-streams-polyfill").WritableStream<Uint8Array>;
    constructor(socket: AdbSocket);
}
//# sourceMappingURL=buffered.d.ts.map