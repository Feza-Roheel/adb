import Struct from '@yume-chan/struct';
import { WritableStreamDefaultWriter } from "../../stream/index.js";
export declare enum AdbSyncRequestId {
    List = "LIST",
    List2 = "LIS2",
    Send = "SEND",
    Lstat = "STAT",
    Stat = "STA2",
    Lstat2 = "LST2",
    Data = "DATA",
    Done = "DONE",
    Receive = "RECV"
}
export declare const AdbSyncNumberRequest: Struct<{
    id: string;
    arg: number;
}, never, {}, undefined>;
export declare const AdbSyncDataRequest: Struct<{
    id: string;
    arg: number;
    data: Uint8Array;
}, "arg", {}, undefined>;
export declare function adbSyncWriteRequest(writer: WritableStreamDefaultWriter<Uint8Array>, id: AdbSyncRequestId | string, value: number | string | Uint8Array): Promise<void>;
//# sourceMappingURL=request.d.ts.map