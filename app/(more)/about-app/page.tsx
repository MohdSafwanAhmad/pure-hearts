// app/about-app/page.tsx
export const metadata = { title: "About App" }
export default function Page() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold">About the App</h1>
      <p className="mt-2 text-muted-foreground">Learn more about Pure Hearts.</p>
    </main>
  )
}
