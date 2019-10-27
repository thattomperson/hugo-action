const core = require('@actions/core');
const github = require('@actions/github');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const os = require('os')

async function run() {
  try {
    const version = core.getInput('version') || '0.59.0'
    const extended = core.getInput('extended') || false

    const fullVersion = `${extended ? 'extended_' : ''}${version}`

    const platform = getPlatform()
    const url = `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo${fullVersion}_${platform}.tar.gz`

    core.debug(`download ${url}`)

    const hugoPath = await tc.downloadTool(url)

    await io.mkdirP(`${hugoPath}/tmp/`)
    const hugoExtractedFolder = await tc.extractTar(hugoPath, `${hugoPath}/tmp/`);
    hugoBin = `${hugoExtractedFolder}/hugo`;

    await tc.cacheFile(hugoBin, 'hugo', 'hugo', fullVersion)

  } catch (error) {
    core.setFailed(error.message);
  }
}

'aix'
        | 'android'
        | 'darwin'
        | 'freebsd'
        | 'linux'
        | 'openbsd'
        | 'sunos'
        | 'win32'
        | 'cygwin'
        | 'netbsd';

function getPlatform() {
  switch (os.platform()) {
    case "darwin":
      return "macOS-64bit";
    case "win32":
    case "cygwin":
      return "Windows-64bit";
    case "linux":
      return "Linux-64bit"
  }

  throw "Unrecognised platform"
}


run()