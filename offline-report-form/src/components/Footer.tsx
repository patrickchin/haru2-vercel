import { Button } from "./ui/button";

export default function Footer({ updateReport }: { updateReport: () => void }) {
  return (
    <footer className="flex flex-col justify-end md:flex-row gap-2 p-4 border rounded bg-muted">
      <Button type="button" variant="outline" disabled>
        View Report (Coming Soon)
      </Button>
      <Button type="button" onClick={updateReport} variant="outline">
        Save Locally
      </Button>
      <Button type="button" variant="default" disabled>
        Upload (Coming Soon)
      </Button>
    </footer>
  );
}
