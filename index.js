const core = require('@actions/core');
const github = require('@actions/github');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    const version = core.getInput('version') || '0.59.0'
    const extended = core.getInput('extended') || false

    const platform = getPlatform()

    const hugoPath = await tc.downloadTool(`https://github.com/gohugoio/hugo/releases/download/v${version}/hugo${extended ? '_extended' : ''}_${version}_${platform}.tar.gz`)

    await io.mkdirP('/usr/src/hugo/')
    const hugoExtractedFolder = await tc.extractTar(hugoPath, '/usr/src/hugo/');

    const cachedPath = await tc.cacheDir(hugoExtractedFolder, 'hugo', version);
    core.addPath(cachedPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getPlatform() {
  return 'Linux-64bit'
}


run()