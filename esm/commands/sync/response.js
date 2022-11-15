import Struct from '@yume-chan/struct';
import { decodeUtf8 } from "../../utils/index.js";
export var AdbSyncResponseId;
(function (AdbSyncResponseId) {
    AdbSyncResponseId["Entry"] = "DENT";
    AdbSyncResponseId["Entry2"] = "DNT2";
    AdbSyncResponseId["Lstat"] = "STAT";
    AdbSyncResponseId["Stat"] = "STA2";
    AdbSyncResponseId["Lstat2"] = "LST2";
    AdbSyncResponseId["Done"] = "DONE";
    AdbSyncResponseId["Data"] = "DATA";
    AdbSyncResponseId["Ok"] = "OKAY";
    AdbSyncResponseId["Fail"] = "FAIL";
})(AdbSyncResponseId = AdbSyncResponseId || (AdbSyncResponseId = {}));
// DONE responses' size are always same as the request's normal response.
// For example DONE responses for LIST requests are 16 bytes (same as DENT responses),
// but DONE responses for STAT requests are 12 bytes (same as STAT responses)
// So we need to know responses' size in advance.
export class AdbSyncDoneResponse {
    length;
    id = AdbSyncResponseId.Done;
    constructor(length) {
        this.length = length;
    }
    async deserialize(stream) {
        await stream.read(this.length);
        return this;
    }
}
export const AdbSyncFailResponse = new Struct({ littleEndian: true })
    .uint32('messageLength')
    .string('message', { lengthField: 'messageLength' })
    .postDeserialize(object => {
    throw new Error(object.message);
});
export async function adbSyncReadResponse(stream, types) {
    const id = decodeUtf8(await stream.read(4));
    if (id === AdbSyncResponseId.Fail) {
        await AdbSyncFailResponse.deserialize(stream);
    }
    if (types[id]) {
        return types[id].deserialize(stream);
    }
    throw new Error(`Expected '${Object.keys(types).join(', ')}', but got '${id}'`);
}
//# sourceMappingURL=response.js.map