const builder = require("electron-builder");
const Platform = builder.Platform;

builder.build({
  targets: Platform.WINDOWS.createTarget(),
  publish: "never",
  config: {
    appId: "com.abl.youtube",
    productName: "ABL Youtube",
    publish: [{
      provider: "generic",
      url: "https://example.com"
    }],
    compression: "maximum",
    directories: {
      output: "Instaladores"
    },
    files: [
      "dist/**/*",
      "dist-electron/**/*"
    ],
    extraResources: [
      {
        from: "bin",
        to: "bin",
        filter: ["**/*"]
      }
    ],
    nsis: {
      oneClick: true,
      perMachine: false,
      createDesktopShortcut: true,
      runAfterFinish: true,
      unicode: true,
      differentialPackage: false,
      installerIcon: "icon.ico",
      uninstallerIcon: "icon.ico",
      installerHeaderIcon: "icon.ico"
    },
    win: {
      icon: "icon.ico",
      sign: async () => {
        // Custom noop signing function to completely bypass signtool.exe and elevate.exe signing hangs
        return;
      },
      target: [
        {
          target: "nsis",
          arch: ["x64"]
        }
      ],
      artifactName: "${productName} Setup ${version}.${ext}"
    }
  }
})
.then((result) => {
  console.log("Build complete! Installer created at:", result);
})
.catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
