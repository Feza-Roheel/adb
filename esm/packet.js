import Struct from '@yume-chan/struct';
import { TransformStream } from "./stream/index.js";
export var AdbCommand;
(function (AdbCommand) {
    AdbCommand[AdbCommand["Auth"] = 1213486401] = "Auth";
    AdbCommand[AdbCommand["Close"] = 1163086915] = "Close";
    AdbCommand[AdbCommand["Connect"] = 1314410051] = "Connect";
    AdbCommand[AdbCommand["OK"] = 1497451343] = "OK";
    AdbCommand[AdbCommand["Open"] = 1313165391] = "Open";
    AdbCommand[AdbCommand["Write"] = 1163154007] = "Write";
})(AdbCommand = AdbCommand || (AdbCommand = {}));
export const AdbPacketHeader = new Struct({ littleEndian: true })
    .uint32('command')
    .uint32('arg0')
    .uint32('arg1')
    .uint32('payloadLength')
    .uint32('checksum')
    .int32('magic');
export const AdbPacket = new Struct({ littleEndian: true })
    .fields(AdbPacketHeader)
    .uint8Array('payload', { lengthField: 'payloadLength' });
export function calculateChecksum(payload) {
    if (payload instanceof Uint8Array) {
        return payload.reduce((result, item) => result + item, 0);
    }
    else {
        payload.checksum = calculateChecksum(payload.payload);
        return payload;
    }
}
export class AdbPacketSerializeStream extends TransformStream {
    constructor() {
        super({
            transform: async (init, controller) => {
                // This syntax is ugly, but I don't want to create a new object.
                init.magic = init.command ^ 0xFFFFFFFF;
                init.payloadLength = init.payload.byteLength;
                controller.enqueue(AdbPacketHeader.serialize(init));
                if (init.payload.byteLength) {
                    // Enqueue payload separately to avoid copying
                    controller.enqueue(init.payload);
                }
            },
        });
    }
}
//# sourceMappingURL=packet.js.map