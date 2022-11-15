import Struct from '@yume-chan/struct';
import { encodeUtf8 } from "../../utils/index.js";
export var AdbSyncRequestId;
(function (AdbSyncRequestId) {
    AdbSyncRequestId["List"] = "LIST";
    AdbSyncRequestId["List2"] = "LIS2";
    AdbSyncRequestId["Send"] = "SEND";
    AdbSyncRequestId["Lstat"] = "STAT";
    AdbSyncRequestId["Stat"] = "STA2";
    AdbSyncRequestId["Lstat2"] = "LST2";
    AdbSyncRequestId["Data"] = "DATA";
    AdbSyncRequestId["Done"] = "DONE";
    AdbSyncRequestId["Receive"] = "RECV";
})(AdbSyncRequestId = AdbSyncRequestId || (AdbSyncRequestId = {}));
export const AdbSyncNumberRequest = new Struct({ littleEndian: true })
    .string('id', { length: 4 })
    .uint32('arg');
export const AdbSyncDataRequest = new Struct({ littleEndian: true })
    .fields(AdbSyncNumberRequest)
    .uint8Array('data', { lengthField: 'arg' });
export async function adbSyncWriteRequest(writer, id, value) {
    let buffer;
    if (typeof value === 'number') {
        buffer = AdbSyncNumberRequest.serialize({
            id,
            arg: value,
        });
    }
    else if (typeof value === 'string') {
        buffer = AdbSyncDataRequest.serialize({
            id,
            data: encodeUtf8(value),
        });
    }
    else {
        buffer = AdbSyncDataRequest.serialize({
            id,
            data: value,
        });
    }
    await writer.write(buffer);
}
//# sourceMappingURL=request.js.map