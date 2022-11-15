export declare class AdbWebUsbBackendWatcher {
    private callback;
    constructor(callback: (newDeviceSerial?: string) => void);
    dispose(): void;
    private handleConnect;
    private handleDisconnect;
}
//# sourceMappingURL=watcher.d.ts.map