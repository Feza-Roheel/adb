// The order follows
// https://android.googlesource.com/platform/packages/modules/adb/+/79010dc6d5ca7490c493df800d4421730f5466ca/transport.cpp#1252
export var AdbFeatures;
(function (AdbFeatures) {
    AdbFeatures["ShellV2"] = "shell_v2";
    AdbFeatures["Cmd"] = "cmd";
    AdbFeatures["StatV2"] = "stat_v2";
    AdbFeatures["ListV2"] = "ls_v2";
    AdbFeatures["FixedPushMkdir"] = "fixed_push_mkdir";
})(AdbFeatures = AdbFeatures || (AdbFeatures = {}));
//# sourceMappingURL=features.js.map