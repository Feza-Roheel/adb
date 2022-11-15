import Struct, { placeholder } from '@yume-chan/struct';
import { AdbSyncRequestId, adbSyncWriteRequest } from './request.js';
import { adbSyncReadResponse, AdbSyncResponseId } from './response.js';
// https://github.com/python/cpython/blob/4e581d64b8aff3e2eda99b12f080c877bb78dfca/Lib/stat.py#L36
export var LinuxFileType;
(function (LinuxFileType) {
    LinuxFileType[LinuxFileType["Directory"] = 4] = "Directory";
    LinuxFileType[LinuxFileType["File"] = 8] = "File";
    LinuxFileType[LinuxFileType["Link"] = 10] = "Link";
})(LinuxFileType = LinuxFileType || (LinuxFileType = {}));
export const AdbSyncLstatResponse = new Struct({ littleEndian: true })
    .int32('mode')
    .int32('size')
    .int32('mtime')
    .extra({
    id: AdbSyncResponseId.Lstat,
    get type() { return this.mode >> 12; },
    get permission() { return this.mode & 4095; },
})
    .postDeserialize((object) => {
    if (object.mode === 0 &&
        object.size === 0 &&
        object.mtime === 0) {
        throw new Error('lstat failed');
    }
});
export var AdbSyncStatErrorCode;
(function (AdbSyncStatErrorCode) {
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["SUCCESS"] = 0] = "SUCCESS";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EACCES"] = 13] = "EACCES";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EEXIST"] = 17] = "EEXIST";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EFAULT"] = 14] = "EFAULT";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EFBIG"] = 27] = "EFBIG";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EINTR"] = 4] = "EINTR";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EINVAL"] = 22] = "EINVAL";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EIO"] = 5] = "EIO";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EISDIR"] = 21] = "EISDIR";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ELOOP"] = 40] = "ELOOP";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EMFILE"] = 24] = "EMFILE";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENAMETOOLONG"] = 36] = "ENAMETOOLONG";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENFILE"] = 23] = "ENFILE";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENOENT"] = 2] = "ENOENT";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENOMEM"] = 12] = "ENOMEM";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENOSPC"] = 28] = "ENOSPC";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ENOTDIR"] = 20] = "ENOTDIR";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EOVERFLOW"] = 75] = "EOVERFLOW";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EPERM"] = 1] = "EPERM";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["EROFS"] = 30] = "EROFS";
    AdbSyncStatErrorCode[AdbSyncStatErrorCode["ETXTBSY"] = 26] = "ETXTBSY";
})(AdbSyncStatErrorCode = AdbSyncStatErrorCode || (AdbSyncStatErrorCode = {}));
export const AdbSyncStatResponse = new Struct({ littleEndian: true })
    .uint32('error', placeholder())
    .uint64('dev')
    .uint64('ino')
    .uint32('mode')
    .uint32('nlink')
    .uint32('uid')
    .uint32('gid')
    .uint64('size')
    .uint64('atime')
    .uint64('mtime')
    .uint64('ctime')
    .extra({
    id: AdbSyncResponseId.Stat,
    get type() { return this.mode >> 12; },
    get permission() { return this.mode & 4095; },
})
    .postDeserialize((object) => {
    if (object.error) {
        throw new Error(AdbSyncStatErrorCode[object.error]);
    }
});
const STAT_RESPONSE_TYPES = {
    [AdbSyncResponseId.Stat]: AdbSyncStatResponse,
};
const LSTAT_RESPONSE_TYPES = {
    [AdbSyncResponseId.Lstat]: AdbSyncLstatResponse,
};
const LSTAT_V2_RESPONSE_TYPES = {
    [AdbSyncResponseId.Lstat2]: AdbSyncStatResponse,
};
export async function adbSyncLstat(stream, writer, path, v2) {
    let requestId;
    let responseType;
    if (v2) {
        requestId = AdbSyncRequestId.Lstat2;
        responseType = LSTAT_V2_RESPONSE_TYPES;
    }
    else {
        requestId = AdbSyncRequestId.Lstat;
        responseType = LSTAT_RESPONSE_TYPES;
    }
    await adbSyncWriteRequest(writer, requestId, path);
    const response = await adbSyncReadResponse(stream, responseType);
    switch (response.id) {
        case AdbSyncResponseId.Lstat:
            return {
                mode: response.mode,
                size: BigInt(response.size),
                mtime: BigInt(response.mtime),
                get type() { return response.type; },
                get permission() { return response.permission; },
            };
        default:
            return response;
    }
}
export async function adbSyncStat(stream, writer, path) {
    await adbSyncWriteRequest(writer, AdbSyncRequestId.Stat, path);
    return await adbSyncReadResponse(stream, STAT_RESPONSE_TYPES);
}
//# sourceMappingURL=stat.js.map