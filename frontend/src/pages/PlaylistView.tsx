import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { playlistApi } from "../lib/api";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

export default function PlaylistView() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const { data: playlist } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => playlistApi.get(playlistId as string),
    enabled: Boolean(playlistId),
  });

  if (!playlist) {
    return <Card>Loading playlist...</Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-ink-900">
              {playlist.name}
            </h1>
            <p className="text-ink-500">{playlist.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/playlists/${playlistId}/edit`)}>
              Edit playlist
            </Button>
            <Link to="/playlists">
              <Button variant="ghost">Back to list</Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink-900">Videos</h2>
        {(playlist.videos ?? []).length === 0 && (
          <p className="text-ink-500">No videos added yet.</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {(playlist.videos ?? []).map((video: any) => (
            <div
              key={video._id ?? video}
              className="surface-box flex gap-4 rounded-[16px] p-4"
            >
              <div className="surface-media h-20 w-32 overflow-hidden rounded-[16px]">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title ?? "Video thumbnail"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-500">
                    No thumbnail
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink-900">
                  {video.title ?? video._id ?? video}
                </p>
                {video.description && (
                  <p className="text-sm text-ink-500">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
