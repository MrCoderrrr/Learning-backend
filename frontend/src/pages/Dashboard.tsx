import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../lib/api";
import { Card } from "../components/Card";
import { Skeleton } from "../components/Skeleton";
import { formatNumber } from "../lib/utils";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.stats(),
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["dashboard-videos"],
    queryFn: () => dashboardApi.videos(),
  });

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-semibold text-ink-900">
          Channel dashboard
        </h1>
        <p className="text-ink-500">Live metrics from your channel.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {(statsLoading ? Array.from({ length: 4 }) : [1, 2, 3, 4]).map(
            (_, index) => (
              <div
                key={index}
                className="surface-box rounded-[16px] p-4"
              >
                {statsLoading ? (
                  <Skeleton className="h-6" />
                ) : (
                  <>
                    <p className="text-sm text-ink-500">
                      {index === 0 && "Subscribers"}
                      {index === 1 && "Total videos"}
                      {index === 2 && "Total views"}
                      {index === 3 && "Total likes"}
                    </p>
                    <p className="text-2xl font-semibold text-ink-900">
                      {index === 0 && formatNumber(stats?.totalSubscribers)}
                      {index === 1 && formatNumber(stats?.totalVideos)}
                      {index === 2 && formatNumber(stats?.totalViews)}
                      {index === 3 && formatNumber(stats?.totalLikes)}
                    </p>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink-900">Your videos</h2>
        <div className="space-y-3">
          {videosLoading && <Skeleton className="h-10" />}
          {!videosLoading &&
            (videos ?? []).map((video: any) => (
              <div
                key={video._id}
                className="surface-box flex items-center justify-between rounded-[16px] px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-ink-900">{video.title}</p>
                  <p className="text-xs text-ink-500">{video.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-ink-500">
                  {video.isPublished ? "Live" : "Draft"}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
