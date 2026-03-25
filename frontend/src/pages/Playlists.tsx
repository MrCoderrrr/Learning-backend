import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistApi, apiHelpers } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { useToast } from "../components/Toast";

export default function Playlists() {
  const { user } = useAuth();
  const { push } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data } = useQuery({
    queryKey: ["playlists", user?._id],
    queryFn: () => playlistApi.listByUser(user?._id as string),
    enabled: Boolean(user?._id),
  });

  const createMutation = useMutation({
    mutationFn: () => playlistApi.create({ name, description }),
    onSuccess: () => {
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) =>
      push({
        title: "Playlist creation failed",
        description: apiHelpers.getErrorMessage(
          error,
          "The playlist could not be created. Please add a name and try again."
        ),
        tone: "error",
      }),
  });

  const playlists = data ?? [];

  return (
    <div className="space-y-8">
      <Card className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink-900">
          Your playlists
        </h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Playlist name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <Button onClick={() => createMutation.mutate()}>
          Create playlist
        </Button>
      </Card>

      {playlists.length === 0 && (
        <EmptyState
          title="No playlists yet"
          description="Create a playlist to organize your videos."
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {playlists.map((playlist: any) => (
          <Link key={playlist._id} to={`/playlists/${playlist._id}`}>
            <Card className="transition hover:-translate-y-1 hover:shadow-glow">
              <h3 className="text-xl font-semibold text-ink-900">
                {playlist.name}
              </h3>
              <p className="text-sm text-ink-500">{playlist.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
