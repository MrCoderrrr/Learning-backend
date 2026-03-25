import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authApi, apiHelpers } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authApi.login({
        username: form.username || undefined,
        email: form.email || undefined,
        password: form.password,
      });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      push({ title: "Welcome back", tone: "success" });
      navigate("/");
    } catch (error) {
      push({
        title: "Login failed",
        description: apiHelpers.getErrorMessage(
          error,
          "We could not sign you in. Check your username or email and password, then try again."
        ),
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="bg-orbit fixed inset-0 -z-10" />
      <div className="mx-auto flex min-h-screen w-[min(1100px,94%)] items-center justify-center py-12">
        <Card className="w-full max-w-xl animate-fade-up">
          <h1 className="text-3xl font-semibold text-ink-900">Welcome back</h1>
          <p className="mt-2 text-ink-500">
            Sign in to manage your channel, publish videos, and chat with your
            audience.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Username"
              placeholder="vanshil"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@channel.com"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-ink-500">
            New here?{" "}
            <Link className="font-semibold text-ink-900" to="/register">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
