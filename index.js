const core = require('@actions/core');
const github = require('@actions/github');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    const version = core.getInput('version') || '0.59.0'
    const extended = core.getInput('extended') || false

    const fullVersion = `${extended ? 'extended_' : ''}${version}`


    const platform = getPlatform()

    const hugoPath = await tc.downloadTool(`https://github.com/gohugoio/hugo/releases/download/v${version}/hugo${fullVersion}_${version}_${platform}.tar.gz`)

    await io.mkdirP(`${hugoPath}/tmp/`)
    const hugoExtractedFolder = await tc.extractTar(hugoPath, `${hugoPath}/tmp/`);
    hugoBin = `${hugoExtractedFolder}/hugo`;

    await tc.cacheFile(hugoBin, 'hugo', 'hugo', fullVersion)

  } catch (error) {
    core.setFailed(error.message);
  }
}

function getPlatform() {
  return 'Linux-64bit'
}


run()