// app/my-gifts/page.tsx
export const metadata = { title: "My Gifts" }
export default function Page() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold">My Gifts</h1>
      <p className="mt-2 text-muted-foreground">Track gifts you’ve sent or received.</p>
    </main>
  )
}
