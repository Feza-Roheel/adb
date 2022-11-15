import Struct from '@yume-chan/struct';
import { AdbBufferedStream, ReadableStream, WritableStreamDefaultWriter } from '../../stream/index.js';
import { AdbSyncResponseId } from './response.js';
export declare const AdbSyncDataResponse: Struct<{
    dataLength: number;
    data: Uint8Array;
}, "dataLength", {
    id: AdbSyncResponseId.Data;
}, undefined>;
export declare function adbSyncPull(stream: AdbBufferedStream, writer: WritableStreamDefaultWriter<Uint8Array>, path: string): ReadableStream<Uint8Array>;
//# sourceMappingURL=pull.d.ts.map