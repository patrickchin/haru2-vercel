import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bg-background border-t border-border">
      <div className="flex-1 max-w-6xl py-6 px-8">
        <p className="text-muted-foreground text-sm">© 2024 Harpa Pro</p>
      </div>
    </footer>
  );
}
