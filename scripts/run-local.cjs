const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next")
const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID")
const outLog = path.join(process.cwd(), "start.out.log")
const errLog = path.join(process.cwd(), "start.err.log")

if (!fs.existsSync(buildIdPath)) {
  console.error("Build output not found. Run `npm run build` first.")
  process.exit(1)
}

const out = fs.openSync(outLog, "a")
const err = fs.openSync(errLog, "a")

const child = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", "3000"], {
  detached: true,
  stdio: ["ignore", out, err],
  windowsHide: true,
})

child.unref()

console.log("Local server started in the background.")
console.log("Open http://127.0.0.1:3000")
console.log(`Logs: ${path.basename(outLog)}, ${path.basename(errLog)}`)
