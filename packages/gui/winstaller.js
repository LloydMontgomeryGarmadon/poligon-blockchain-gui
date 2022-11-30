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
    name: "cryptomines-blockchain",
    appDirectory: path.join(rootPath, 'Cryptomines-win32-x64'),
    authors: 'Kopalnie Krypto',
    version: process.env.CRYPTOMINES_INSTALLER_VERSION,
    noMsi: true,
    iconUrl: 'https://raw.githubusercontent.com/serwisgalena/cryptomines-blockchain-gui/main/packages/gui/src/assets/img/cryptomines.ico',
    outputDirectory: path.join(outPath, 'windows-installer'),
    certificateFile: 'win_code_sign_cert.p12',
    certificatePassword: process.env.WIN_CODE_SIGN_PASS,
    exe: 'Cryptomines.exe',
    setupExe: 'CryptominesSetup-' + process.env.CRYPTOMINES_INSTALLER_VERSION + '.exe',
    setupIcon: path.join(rootPath, 'src', 'assets', 'img', 'cryptomines.ico')
  })
}
