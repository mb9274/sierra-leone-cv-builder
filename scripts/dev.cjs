const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

const rootDir = path.resolve(__dirname, "..")

process.chdir(rootDir)

const buildIdPath = path.join(rootDir, ".next", "BUILD_ID")
if (!fs.existsSync(buildIdPath)) {
  execFileSync(process.execPath, [path.join(rootDir, "scripts", "build.cjs")], {
    stdio: "inherit",
  })
}

const nextBin = require.resolve("../node_modules/next/dist/bin/next")
const extraArgs = process.argv.slice(2)
process.argv = [process.execPath, nextBin, "start", "-H", "127.0.0.1", "-p", "3000", ...extraArgs]

require(nextBin)
