export const dynamic = "force-dynamic"

import Link from "next/link"

export default function StatusPage() {
  const localUrl = "http://127.0.0.1:3000"
  const localhostUrl = "http://localhost:3000"

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 shadow-lg">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Local Check</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">Server Status</h1>
        <p className="mt-4 text-muted-foreground">
          If the app is running correctly, one of these addresses should load the homepage:
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={localUrl}
            className="rounded-2xl border border-border bg-background p-5 text-left transition-colors hover:border-primary"
          >
            <span className="block text-sm text-muted-foreground">Preferred</span>
            <span className="mt-1 block font-semibold text-foreground">{localUrl}</span>
          </a>
          <a
            href={localhostUrl}
            className="rounded-2xl border border-border bg-background p-5 text-left transition-colors hover:border-primary"
          >
            <span className="block text-sm text-muted-foreground">Alternative</span>
            <span className="mt-1 block font-semibold text-foreground">{localhostUrl}</span>
          </a>
        </div>

        <div className="mt-8 rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">If you still see connection refused:</p>
          <ul className="mt-3 space-y-2 list-disc pl-5">
            <li>Keep the terminal running after `npm run dev`.</li>
            <li>Use the full address with port `3000`.</li>
            <li>Make sure no other app is blocking local ports in your firewall.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            Go to Home
          </Link>
          <Link href="/dashboard" className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-foreground">
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
