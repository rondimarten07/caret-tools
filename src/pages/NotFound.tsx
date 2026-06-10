import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-12 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="mt-2 text-muted-foreground">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back home
      </Link>
    </div>
  );
}
