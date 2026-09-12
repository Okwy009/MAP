export default function TodayPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Today</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Placeholder Content</h2>
          <p className="text-muted-foreground">Today's dashboard content will go here!</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Another Placeholder</h2>
          <p className="text-muted-foreground">More content coming soon!</p>
        </div>
      </div>
    </div>
  );
}
