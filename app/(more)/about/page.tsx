// app/campaigns/page.tsx

export const metadata = {
  title: "about",
};

export default function aboutPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold">Campaigns</h1>
      <p className="mt-4 text-muted-foreground">
        This is the about us page skeleton.
      </p>
    </main>
  );
}