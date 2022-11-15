import Struct from '@yume-chan/struct';
import { ChunkStream, pipeFrom, WritableStream } from '../../stream/index.js';
import { AdbSyncRequestId, adbSyncWriteRequest } from './request.js';
import { adbSyncReadResponse, AdbSyncResponseId } from './response.js';
import { LinuxFileType } from './stat.js';
export const AdbSyncOkResponse = new Struct({ littleEndian: true })
    .uint32('unused');
const ResponseTypes = {
    [AdbSyncResponseId.Ok]: AdbSyncOkResponse,
};
export const ADB_SYNC_MAX_PACKET_SIZE = 64 * 1024;
export function adbSyncPush(stream, writer, filename, mode = (LinuxFileType.File << 12) | 0o666, mtime = (Date.now() / 1000) | 0, packetSize = ADB_SYNC_MAX_PACKET_SIZE) {
    return pipeFrom(new WritableStream({
        async start() {
            const pathAndMode = `${filename},${mode.toString()}`;
            await adbSyncWriteRequest(writer, AdbSyncRequestId.Send, pathAndMode);
        },
        async write(chunk) {
            await adbSyncWriteRequest(writer, AdbSyncRequestId.Data, chunk);
        },
        async close() {
            await adbSyncWriteRequest(writer, AdbSyncRequestId.Done, mtime);
            await adbSyncReadResponse(stream, ResponseTypes);
        },
    }), new ChunkStream(packetSize));
}
//# sourceMappingURL=push.js.map