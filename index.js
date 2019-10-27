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
    const url = `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${fullVersion}_${platform}.tar.gz`

    core.warning(`download ${url}`)

    const hugoAssets = await tc.downloadTool(url)

    const hugoExtractedFolder = await tc.extractTar(hugoAssets, `/tmp`);
    const hugoTmpBin = `${hugoExtractedFolder}/hugo`;
    const hugoPath = `${process.env.HOME}/bin`;
    await io.mkdirP(hugoPath);
    core.addPath(hugoPath);


    await io.mv(hugoTmpBin, hugoPath)

    await tc.cacheFile(`${hugoPath}/hugo`, 'hugo', 'hugo', fullVersion)

  } catch (error) {
    core.setFailed(error.message);
  }
}

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