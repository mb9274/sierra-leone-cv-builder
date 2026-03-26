export const dynamic = "force-dynamic"

const buildId = process.env.VERCEL_GIT_COMMIT_SHA
  ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  : "local"
const buildEnv = process.env.VERCEL_ENV || "local"
const buildBranch = process.env.VERCEL_GIT_COMMIT_REF || "local"
const buildUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "local"

export default function BuildInfoPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Debug</p>
        <h1 className="mt-3 text-3xl font-bold">Build Info</h1>
        <div className="mt-8 grid gap-4 text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <span className="block text-slate-400">Environment</span>
            <span className="mt-1 block font-medium">{buildEnv}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <span className="block text-slate-400">Branch</span>
            <span className="mt-1 block font-medium">{buildBranch}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <span className="block text-slate-400">Commit</span>
            <span className="mt-1 block font-medium">{buildId}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <span className="block text-slate-400">URL</span>
            <span className="mt-1 block font-medium break-all">{buildUrl}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
