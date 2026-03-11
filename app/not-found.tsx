import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="font-display text-5xl font-light text-forest-950 mb-4">404</h1>
        <p className="text-forest-500 mb-8 text-lg">This page seems to have wandered off the menu.</p>
        <Link href="/" className="btn-primary">Back to Journal</Link>
      </div>
    </div>
  );
}
