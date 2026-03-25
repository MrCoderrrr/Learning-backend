import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { authApi, apiHelpers } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MediaUploader } from "../components/MediaUploader";
import { useToast } from "../components/Toast";

export default function Profile() {
  const { user, refresh } = useAuth();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const [account, setAccount] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
    description: user?.description ?? "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  useEffect(() => {
    setAccount({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      username: user?.username ?? "",
      description: user?.description ?? "",
    });
  }, [user?.fullName, user?.email, user?.username, user?.description]);

  const updateAccount = async () => {
    try {
      await authApi.updateAccount(account);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      push({ title: "Account updated", tone: "success" });
    } catch (error) {
      push({
        title: "Update failed",
        description: apiHelpers.getErrorMessage(
          error,
          "Your profile details could not be saved. Please review the form and try again."
        ),
        tone: "error",
      });
    }
  };

  const updateAvatar = async () => {
    if (!avatar) return;
    const payload = new FormData();
    payload.append("avatar", avatar);
    try {
      await authApi.updateAvatar(payload);
      await refresh();
      setAvatar(null);
      push({ title: "Avatar updated", tone: "success" });
    } catch (error) {
      push({
        title: "Avatar update failed",
        description: apiHelpers.getErrorMessage(
          error,
          "The avatar could not be updated. Please choose a valid image and try again."
        ),
        tone: "error",
      });
    }
  };

  const updateCover = async () => {
    if (!cover) return;
    const payload = new FormData();
    payload.append("coverImage", cover);
    try {
      await authApi.updateCover(payload);
      await refresh();
      setCover(null);
      push({ title: "Cover updated", tone: "success" });
    } catch (error) {
      push({
        title: "Cover update failed",
        description: apiHelpers.getErrorMessage(
          error,
          "The cover image could not be updated. Please choose a valid image and try again."
        ),
        tone: "error",
      });
    }
  };

  const changePassword = async () => {
    try {
      await authApi.changePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      push({ title: "Password changed", tone: "success" });
    } catch (error) {
      push({
        title: "Password update failed",
        description: apiHelpers.getErrorMessage(
          error,
          "Your password could not be changed. Please confirm the old password and make sure the new passwords match."
        ),
        tone: "error",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0">
        {user?.coverImage ? (
          <div className="surface-media h-52 w-full">
            <img
              src={user.coverImage}
              alt={`${user.fullName} cover`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="surface-media h-52 w-full bg-gradient-to-r from-accent-purple/20 via-accent-pink/20 to-accent-cyan/20" />
        )}
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://placehold.co/80x80"}
              className="h-20 w-20 rounded-full border border-white/10 object-cover"
            />
            <div>
              <h1 className="text-3xl font-semibold text-ink-900">
                {user?.fullName}
              </h1>
              <p className="text-ink-500">@{user?.username}</p>
              <p className="mt-2 max-w-2xl text-sm text-ink-500">
                {account.description || "Add a short channel description for your audience."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={updateAccount}>
              Save profile
            </Button>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink-900">
          Account details
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Full name"
            value={account.fullName}
            onChange={(event) =>
              setAccount((prev) => ({ ...prev, fullName: event.target.value }))
            }
          />
          <Input
            label="Email"
            value={account.email}
            onChange={(event) =>
              setAccount((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <Input
            label="Channel name"
            value={account.username}
            onChange={(event) =>
              setAccount((prev) => ({ ...prev, username: event.target.value }))
            }
          />
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink-700">
          <span className="text-ink-700">Description</span>
          <textarea
            className="min-h-28 rounded-[16px] border border-white/10 bg-panel-900 px-4 py-3 text-base text-ink-900 placeholder:text-ink-500 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-accent-purple/30"
            placeholder="Tell people what your channel is about."
            value={account.description}
            onChange={(event) =>
              setAccount((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
        </label>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-900">Avatar</h2>
          <MediaUploader
            label="Upload new avatar"
            accept="image/*"
            file={avatar}
            currentImage={user?.avatar}
            currentLabel={`${user?.fullName ?? "User"} avatar`}
            onChange={setAvatar}
          />
          <Button variant="outline" onClick={updateAvatar}>
            Update avatar
          </Button>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink-900">Cover image</h2>
          <MediaUploader
            label="Upload new cover"
            accept="image/*"
            file={cover}
            currentImage={user?.coverImage}
            currentLabel={`${user?.fullName ?? "User"} cover`}
            onChange={setCover}
          />
          <Button variant="outline" onClick={updateCover}>
            Update cover
          </Button>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink-900">
          Change password
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Old password"
            type="password"
            value={passwords.oldPassword}
            onChange={(event) =>
              setPasswords((prev) => ({
                ...prev,
                oldPassword: event.target.value,
              }))
            }
          />
          <Input
            label="New password"
            type="password"
            value={passwords.newPassword}
            onChange={(event) =>
              setPasswords((prev) => ({
                ...prev,
                newPassword: event.target.value,
              }))
            }
          />
          <Input
            label="Confirm password"
            type="password"
            value={passwords.confirmPassword}
            onChange={(event) =>
              setPasswords((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
          />
        </div>
        <Button onClick={changePassword}>Update password</Button>
      </Card>
    </div>
  );
}
