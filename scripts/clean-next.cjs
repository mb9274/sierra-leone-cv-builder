const fs = require("fs")
const path = require("path")
const os = require("os")

const nextDir = path.join(process.cwd(), ".next")
const tempNextDir = path.join(os.tmpdir(), "ai-cv-builder-next")

try {
  for (const dir of [nextDir, tempNextDir]) {
    fs.rmSync(dir, { recursive: true, force: true })
  }
} catch (error) {
  // Best-effort cleanup only. Windows/OneDrive can keep .next locked briefly.
}
