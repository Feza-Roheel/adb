import Struct, { StructAsyncDeserializeStream, StructLike, StructValueType } from '@yume-chan/struct';
import { AdbBufferedStream } from '../../stream/index.js';
export declare enum AdbSyncResponseId {
    Entry = "DENT",
    Entry2 = "DNT2",
    Lstat = "STAT",
    Stat = "STA2",
    Lstat2 = "LST2",
    Done = "DONE",
    Data = "DATA",
    Ok = "OKAY",
    Fail = "FAIL"
}
export declare class AdbSyncDoneResponse implements StructLike<AdbSyncDoneResponse> {
    private length;
    readonly id = AdbSyncResponseId.Done;
    constructor(length: number);
    deserialize(stream: StructAsyncDeserializeStream): Promise<this>;
}
export declare const AdbSyncFailResponse: Struct<{
    messageLength: number;
    message: string;
}, "messageLength", {}, never>;
export declare function adbSyncReadResponse<T extends Record<string, StructLike<any>>>(stream: AdbBufferedStream, types: T): Promise<StructValueType<T extends unknown ? T[keyof T] : never>>;
//# sourceMappingURL=response.d.ts.map