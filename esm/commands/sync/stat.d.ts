import Struct from '@yume-chan/struct';
import { AdbBufferedStream, WritableStreamDefaultWriter } from '../../stream/index.js';
import { AdbSyncResponseId } from './response.js';
export declare enum LinuxFileType {
    Directory = 4,
    File = 8,
    Link = 10
}
export interface AdbSyncStat {
    mode: number;
    size: bigint;
    mtime: bigint;
    get type(): LinuxFileType;
    get permission(): number;
    uid?: number;
    gid?: number;
    atime?: bigint;
    ctime?: bigint;
}
export declare const AdbSyncLstatResponse: Struct<{
    mode: number;
    size: number;
    mtime: number;
}, never, {
    id: AdbSyncResponseId.Lstat;
    readonly type: LinuxFileType;
    readonly permission: number;
}, undefined>;
export declare type AdbSyncLstatResponse = typeof AdbSyncLstatResponse['TDeserializeResult'];
export declare enum AdbSyncStatErrorCode {
    SUCCESS = 0,
    EACCES = 13,
    EEXIST = 17,
    EFAULT = 14,
    EFBIG = 27,
    EINTR = 4,
    EINVAL = 22,
    EIO = 5,
    EISDIR = 21,
    ELOOP = 40,
    EMFILE = 24,
    ENAMETOOLONG = 36,
    ENFILE = 23,
    ENOENT = 2,
    ENOMEM = 12,
    ENOSPC = 28,
    ENOTDIR = 20,
    EOVERFLOW = 75,
    EPERM = 1,
    EROFS = 30,
    ETXTBSY = 26
}
export declare const AdbSyncStatResponse: Struct<{
    error: AdbSyncStatErrorCode;
    dev: bigint;
    ino: bigint;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    size: bigint;
    atime: bigint;
    mtime: bigint;
    ctime: bigint;
}, never, {
    id: AdbSyncResponseId.Stat;
    readonly type: LinuxFileType;
    readonly permission: number;
}, undefined>;
export declare type AdbSyncStatResponse = typeof AdbSyncStatResponse['TDeserializeResult'];
export declare function adbSyncLstat(stream: AdbBufferedStream, writer: WritableStreamDefaultWriter<Uint8Array>, path: string, v2: boolean): Promise<AdbSyncStat>;
export declare function adbSyncStat(stream: AdbBufferedStream, writer: WritableStreamDefaultWriter<Uint8Array>, path: string): Promise<AdbSyncStatResponse>;
//# sourceMappingURL=stat.d.ts.map