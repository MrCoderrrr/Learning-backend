import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistApi, apiHelpers, videoApi } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { push } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoId, setVideoId] = useState("");
  const [search, setSearch] = useState("");

  const { data: playlist } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => playlistApi.get(playlistId as string),
    enabled: Boolean(playlistId),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["video-suggestions", search],
    queryFn: () =>
      videoApi.list({
        query: search,
        page: 1,
        limit: 8,
        sortBy: "createdAt",
        sortType: "desc",
      }),
    enabled: search.trim().length > 1,
  });

  useEffect(() => {
    if (playlist) {
      setName(playlist.name ?? "");
      setDescription(playlist.description ?? "");
    }
  }, [playlist]);

  const updateMutation = useMutation({
    mutationFn: () =>
      playlistApi.update(playlistId as string, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      navigate(`/playlists/${playlistId}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => playlistApi.delete(playlistId as string),
    onSuccess: () => {
      push({ title: "Playlist deleted", tone: "info" });
      navigate("/playlists");
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: (targetId?: string) =>
      playlistApi.addVideo(targetId ?? videoId, playlistId as string),
    onSuccess: () => {
      setVideoId("");
      setSearch("");
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
    onError: (error) =>
      push({
        title: "Could not add video",
        description: apiHelpers.getErrorMessage(
          error,
          "The selected video could not be added to this playlist. Please try again."
        ),
        tone: "error",
      }),
  });

  const removeVideoMutation = useMutation({
    mutationFn: (targetId: string) =>
      playlistApi.removeVideo(targetId, playlistId as string),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] }),
  });

  if (!playlist) {
    return <Card>Loading playlist...</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink-900">{name}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => updateMutation.mutate()}>Save changes</Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/playlists/${playlistId}`)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteMutation.mutate()}>
            Delete playlist
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink-900">Add a video</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Search by title"
            placeholder="Type a title to see suggestions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            label="Or paste Video ID"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
          />
        </div>
        {search.trim().length > 1 && (
          <div className="surface-box-soft space-y-2 rounded-[16px] p-3">
            <p className="text-sm font-semibold text-ink-700">
              Suggestions
            </p>
            {(suggestions?.videos ?? []).length === 0 && (
              <p className="text-sm text-ink-500">No matches yet.</p>
            )}
            {(suggestions?.videos ?? []).map((video: any) => (
              <button
                key={video._id}
                onClick={() => addVideoMutation.mutate(video._id)}
                className="surface-box flex w-full items-center justify-between rounded-[16px] px-3 py-2 text-left text-sm transition hover:border-white/20"
              >
                <span className="font-medium text-ink-900">{video.title}</span>
                <span className="text-xs text-ink-500">{video._id}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => addVideoMutation.mutate(videoId)}
            disabled={!videoId.trim()}
          >
            Add video
          </Button>
          <span className="text-xs text-ink-500">
            Add by selecting a suggestion or by Video ID.
          </span>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink-900">Videos</h2>
        {(playlist.videos ?? []).length === 0 && (
          <p className="text-ink-500">No videos added yet.</p>
        )}
        {(playlist.videos ?? []).map((video: any) => (
          <div
            key={video._id ?? video}
            className="surface-box flex items-center justify-between rounded-[16px] px-4 py-3"
          >
            <div>
              <p className="font-semibold text-ink-900">
                {video.title ?? video._id ?? video}
              </p>
              {video.description && (
                <p className="text-sm text-ink-500">{video.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={() => removeVideoMutation.mutate(video._id ?? video)}
            >
              Remove
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
