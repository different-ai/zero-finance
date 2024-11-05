/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "com.hyprsqrl.app",
  productName: "HyprSqrl",
  directories: {
    output: "release",
    buildResources: "build",
  },
  files: [
    "dist/**/*",
    "package.json"
  ],
  mac: {
    target: ["dmg", "zip"],
    category: "public.app-category.productivity",
    icon: "build/icon.icns",
  },
  win: {
    target: ["nsis", "zip"],
  },
  linux: {
    target: ["AppImage", "deb"],
    category: "Productivity",
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
} 