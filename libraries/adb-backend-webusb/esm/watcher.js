export class AdbWebUsbBackendWatcher {
    callback;
    constructor(callback) {
        this.callback = callback;
        window.navigator.usb.addEventListener('connect', this.handleConnect);
        window.navigator.usb.addEventListener('disconnect', this.handleDisconnect);
    }
    dispose() {
        window.navigator.usb.removeEventListener('connect', this.handleConnect);
        window.navigator.usb.removeEventListener('disconnect', this.handleDisconnect);
    }
    handleConnect = (e) => {
        this.callback(e.device.serialNumber);
    };
    handleDisconnect = () => {
        this.callback();
    };
}
//# sourceMappingURL=watcher.js.map