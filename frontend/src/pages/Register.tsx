import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { authApi, apiHelpers } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MediaUploader } from "../components/MediaUploader";
import { useToast } from "../components/Toast";

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!avatar) {
      push({ title: "Avatar is required", tone: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("fullName", form.fullName);
      payload.append("email", form.email);
      payload.append("username", form.username);
      payload.append("password", form.password);
      payload.append("avatar", avatar);
      if (coverImage) {
        payload.append("coverImage", coverImage);
      }
      await authApi.register(payload);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      push({ title: "Account created", tone: "success" });
      navigate("/");
    } catch (error) {
      push({
        title: "Registration failed",
        description: apiHelpers.getErrorMessage(
          error,
          "Your account could not be created. Please review your details and try again."
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
        <Card className="w-full max-w-2xl animate-fade-up">
          <h1 className="text-3xl font-semibold text-ink-900">
            Build your channel
          </h1>
          <p className="mt-2 text-ink-500">
            Create an account and start publishing rich video stories.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full name"
                value={form.fullName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, fullName: event.target.value }))
                }
              />
              <Input
                label="Username"
                value={form.username}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, username: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <MediaUploader
                label="Avatar"
                file={avatar}
                accept="image/*"
                onChange={setAvatar}
              />
              <MediaUploader
                label="Cover image (optional)"
                file={coverImage}
                accept="image/*"
                onChange={setCoverImage}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-sm text-ink-500">
            Already have an account?{" "}
            <Link className="font-semibold text-ink-900" to="/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
