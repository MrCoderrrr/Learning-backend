import { useQuery } from "@tanstack/react-query";
import { likeApi } from "../lib/api";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "../lib/utils";

export default function Likes() {
  const { data } = useQuery({
    queryKey: ["liked-videos"],
    queryFn: () => likeApi.likedVideos(),
  });

  const likes = data ?? [];

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold text-ink-900">Liked videos</h1>
      {likes.length === 0 && (
        <EmptyState
          title="No liked videos yet"
          description="Like a video to save it here."
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {likes.map((like: any) => (
          <div
            key={like._id}
            className="surface-box rounded-[16px] p-4"
          >
            <p className="font-semibold text-ink-900">
              {like.video?.title ?? "Untitled"}
            </p>
            <p className="text-sm text-ink-500">
              {like.video?.description ?? ""}
            </p>
            <p className="text-xs text-ink-500">
              Liked {formatDate(like.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
