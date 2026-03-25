import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-orbit fixed inset-0 -z-10" />
      <div className="mx-auto flex min-h-screen w-[min(1100px,94%)] items-center justify-center">
        <Card className="max-w-xl text-center">
          <h1 className="text-4xl font-semibold text-ink-900">Page missing</h1>
          <p className="mt-3 text-ink-500">
            The page you’re looking for has moved or never existed.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button>Return to feed</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
