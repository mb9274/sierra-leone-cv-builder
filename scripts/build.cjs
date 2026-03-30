const nextBin = require.resolve("../node_modules/next/dist/bin/next")
const path = require("path")

const rootDir = path.resolve(__dirname, "..")

process.chdir(rootDir)

require("./prepare-next.cjs")

process.env.NEXT_DISABLE_WORKERS = "1"

const extraArgs = process.argv.slice(2)
process.argv = [process.execPath, nextBin, "build", "--webpack", ...extraArgs]

require(nextBin)
