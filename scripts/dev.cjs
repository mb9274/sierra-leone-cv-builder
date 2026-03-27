const nextBin = require.resolve("../node_modules/next/dist/bin/next")

process.env.NEXT_DISABLE_WORKERS = "1"

const extraArgs = process.argv.slice(2)
process.argv = [process.execPath, nextBin, "dev", "--webpack", "-H", "127.0.0.1", "-p", "3000", ...extraArgs]

require(nextBin)
