import Struct from '@yume-chan/struct';
import { AdbBufferedStream, WritableStream, WritableStreamDefaultWriter } from '../../stream/index.js';
export declare const AdbSyncOkResponse: Struct<{
    unused: number;
}, never, {}, undefined>;
export declare const ADB_SYNC_MAX_PACKET_SIZE: number;
export declare function adbSyncPush(stream: AdbBufferedStream, writer: WritableStreamDefaultWriter<Uint8Array>, filename: string, mode?: number, mtime?: number, packetSize?: number): WritableStream<Uint8Array>;
//# sourceMappingURL=push.d.ts.map