'use client';

export default function GlobalError({
  error, reset,
}: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="p-6">
        <h2 className="text-xl font-semibold">Something went wrong.</h2>
        <pre className="mt-2 text-sm opacity-80">{String(error?.message)}</pre>
        <button className="mt-4 rounded border px-3 py-2" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
