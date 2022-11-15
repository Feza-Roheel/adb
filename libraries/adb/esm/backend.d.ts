import type { ValueOrPromise } from '@yume-chan/struct';
import type { AdbPacketData, AdbPacketInit } from "./packet.js";
import type { ReadableWritablePair } from "./stream/index.js";
export interface AdbBackend {
    readonly serial: string;
    readonly name: string | undefined;
    connect(): ValueOrPromise<ReadableWritablePair<AdbPacketData, AdbPacketInit>>;
}
//# sourceMappingURL=backend.d.ts.map