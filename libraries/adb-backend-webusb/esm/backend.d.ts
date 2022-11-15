/// <reference types="w3c-web-usb" />
import { ReadableStream, WritableStream, AdbBackend, AdbPacketData, AdbPacketInit, ReadableWritablePair } from '@yume-chan/adb';
export declare const ADB_DEVICE_FILTER: USBDeviceFilter;
export declare class AdbWebUsbBackendStream implements ReadableWritablePair<AdbPacketData, AdbPacketInit> {
    private _readable;
    get readable(): ReadableStream<AdbPacketData>;
    private _writable;
    get writable(): WritableStream<AdbPacketInit>;
    constructor(device: USBDevice, inEndpoint: USBEndpoint, outEndpoint: USBEndpoint);
}
export declare class AdbWebUsbBackend implements AdbBackend {
    static isSupported(): boolean;
    static getDevices(): Promise<AdbWebUsbBackend[]>;
    static requestDevice(): Promise<AdbWebUsbBackend | undefined>;
    private _device;
    get serial(): string;
    get name(): string;
    constructor(device: USBDevice);
    connect(): Promise<AdbWebUsbBackendStream>;
}
//# sourceMappingURL=backend.d.ts.map