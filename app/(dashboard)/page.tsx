export default function TodayPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Today</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Placeholder Content</h2>
          <p className="text-muted-foreground">
            Today's dashboard content will go here!
          </p>
        </div>
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Another Placeholder</h2>
          <p className="text-muted-foreground">
            More content coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
