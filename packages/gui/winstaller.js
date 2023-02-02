const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('Creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    name: "poligon-blockchain",
    appDirectory: path.join(rootPath, 'Poligon-win32-x64'),
    authors: 'Kopalnie Krypto',
    version: process.env.POLIGON_INSTALLER_VERSION,
    noMsi: true,
    iconUrl: 'https://raw.githubusercontent.com/serwisgalena/poligon-blockchain-gui/main/packages/gui/src/assets/img/poligon.ico',
    outputDirectory: path.join(outPath, 'windows-installer'),
    certificateFile: 'win_code_sign_cert.p12',
    certificatePassword: process.env.WIN_CODE_SIGN_PASS,
    exe: 'Poligon.exe',
    setupExe: 'PoligonSetup-' + process.env.POLIGON_INSTALLER_VERSION + '.exe',
    setupIcon: path.join(rootPath, 'src', 'assets', 'img', 'poligon.ico')
  })
}
