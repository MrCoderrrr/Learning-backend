import { useQuery } from "@tanstack/react-query";
import { authApi } from "../lib/api";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "../lib/utils";

export default function WatchHistory() {
  const { data } = useQuery({
    queryKey: ["watch-history"],
    queryFn: () => authApi.getWatchHistory(),
  });

  const history = data ?? [];

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold text-ink-900">Watch history</h1>
      {history.length === 0 && (
        <EmptyState
          title="No watch history yet"
          description="Start watching videos to build your viewing trail."
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {history.map((video: any) => (
          <div
            key={video._id}
            className="surface-box rounded-[16px] p-4"
          >
            <p className="font-semibold text-ink-900">{video.title}</p>
            <p className="text-sm text-ink-500">{video.description}</p>
            <p className="text-xs text-ink-500">
              Added {formatDate(video.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
