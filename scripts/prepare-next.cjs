const fs = require("fs")
const os = require("os")
const path = require("path")

const workerFile = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "lib",
  "worker.js",
)
const nextDir = path.join(process.cwd(), ".next")
const tempNextDir = path.join(os.tmpdir(), "ai-cv-builder-next")

function patchNextWorker() {
  const original = fs.readFileSync(workerFile, "utf8")
  if (original.includes("NEXT_DISABLE_WORKERS === '1'")) {
    return
  }

  const needle = [
    "        this._worker = undefined;",
    "        // ensure we end workers if they weren't before exit",
    "        process.on('exit', ()=>{",
    "            this.close();",
    "        });",
  ].join("\n")

  const replacement = [
    "        this._worker = undefined;",
    "        if (process.env.NEXT_DISABLE_WORKERS === '1') {",
    "            const workerModule = require(workerPath);",
    "            this._worker = {",
    "                _workerPool: {",
    "                    _workers: []",
    "                },",
    "                getStdout () {",
    "                    const stream = new _stream.PassThrough();",
    "                    stream.end();",
    "                    return stream;",
    "                },",
    "                getStderr () {",
    "                    const stream = new _stream.PassThrough();",
    "                    stream.end();",
    "                    return stream;",
    "                },",
    "                end () {",
    "                    return Promise.resolve();",
    "                }",
    "            };",
    "            for (const method of farmOptions.exposedMethods){",
    "                if (method.startsWith('_')) continue;",
    "                this[method] = async (...args)=>workerModule[method](...args);",
    "            }",
    "            return;",
    "        }",
    "        // ensure we end workers if they weren't before exit",
    "        process.on('exit', ()=>{",
    "            this.close();",
    "        });",
  ].join("\n")

  if (!original.includes(needle)) {
    throw new Error("Could not locate Next worker block to patch.")
  }

  fs.writeFileSync(workerFile, original.replace(needle, replacement))
}

try {
  patchNextWorker()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
}

for (const dir of [nextDir, tempNextDir]) {
  fs.rmSync(dir, { recursive: true, force: true })
}
