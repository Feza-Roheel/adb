import Struct from '@yume-chan/struct';
import { ReadableStream } from '../../stream/index.js';
import { AdbSyncRequestId, adbSyncWriteRequest } from './request.js';
import { AdbSyncDoneResponse, adbSyncReadResponse, AdbSyncResponseId } from './response.js';
export const AdbSyncDataResponse = new Struct({ littleEndian: true })
    .uint32('dataLength')
    .uint8Array('data', { lengthField: 'dataLength' })
    .extra({ id: AdbSyncResponseId.Data });
const RESPONSE_TYPES = {
    [AdbSyncResponseId.Data]: AdbSyncDataResponse,
    [AdbSyncResponseId.Done]: new AdbSyncDoneResponse(AdbSyncDataResponse.size),
};
export function adbSyncPull(stream, writer, path) {
    return new ReadableStream({
        async start() {
            await adbSyncWriteRequest(writer, AdbSyncRequestId.Receive, path);
        },
        async pull(controller) {
            const response = await adbSyncReadResponse(stream, RESPONSE_TYPES);
            switch (response.id) {
                case AdbSyncResponseId.Data:
                    controller.enqueue(response.data);
                    break;
                case AdbSyncResponseId.Done:
                    controller.close();
                    break;
                default:
                    throw new Error('Unexpected response id');
            }
        },
        cancel() {
            throw new Error(`Sync commands don't support cancel.`);
        },
    }, {
        highWaterMark: 16 * 1024,
        size(chunk) { return chunk.byteLength; }
    });
}
//# sourceMappingURL=pull.js.map