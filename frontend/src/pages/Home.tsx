import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { videoApi } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";
import { formatNumber, formatDate } from "../lib/utils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["videos", query, sortBy, sortType],
    queryFn: () =>
      videoApi.list({
        query: query || undefined,
        sortBy,
        sortType,
        page: 1,
        limit: 12,
      }) as Promise<{
        videos: any[];
        total: number;
        page: number;
        limit: number;
      }>,
  });

  const videos = data?.videos ?? [];

  const filtersPanel = (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-ink-500">
            Discover
          </p>
          <h3 className="text-xl font-semibold text-ink-900">Smart filters</h3>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(false)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/10 bg-white/5 text-ink-900 transition hover:bg-white/10 xl:hidden"
          aria-label="Close filters"
        >
          ✕
        </button>
      </div>
      <Input
        label="Search"
        placeholder="Search titles and descriptions"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="grid gap-3 xl:grid-cols-1 2xl:gap-4">
        <label className="text-sm font-medium text-ink-700">
          Sort by
          <select
            className="control-dark mt-2 w-full rounded-[16px] px-4 py-2"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="createdAt">Newest</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink-700">
          Sort order
          <select
            className="control-dark mt-2 w-full rounded-[16px] px-4 py-2"
            value={sortType}
            onChange={(event) => setSortType(event.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[clamp(260px,24vw,360px)_minmax(0,1fr)] 2xl:gap-8">
        <aside className="hidden xl:block">
          <div className="sticky top-28 2xl:top-32">{filtersPanel}</div>
        </aside>

        <div className="space-y-8">
          <section className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-ink-500">
              The Studio Feed
            </p>
            <h1 className="text-balance text-4xl font-semibold text-ink-900 sm:text-5xl 2xl:text-6xl">
              Curate, publish, and shape your{" "}
              <span className="bg-gradient-to-r from-accent-purple via-accent-pink to-accent-cyan bg-clip-text text-transparent">
                video universe
              </span>
              .
            </h1>
            <p className="max-w-3xl text-base text-ink-500 sm:text-lg 2xl:text-xl">
              Discover the latest uploads, explore trending voices, and keep your
              channel moving with real-time audience signals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => refetch()}>Refresh feed</Button>
              <Link to="/videos/publish">
                <Button variant="outline">Publish a video</Button>
              </Link>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="surface-box inline-flex items-center gap-2 rounded-[16px] px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-white/10 xl:hidden"
              >
                <span className="flex flex-col gap-1">
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                  <span className="h-0.5 w-4 rounded-full bg-current" />
                </span>
                Filters
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-[1800px]:grid-cols-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <Skeleton className="h-40 sm:h-44 lg:h-48 2xl:h-56" />
                  <Skeleton className="mt-4 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </Card>
              ))}
            {!isLoading && videos.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 min-[1800px]:col-span-4">
                <EmptyState
                  title="No videos yet"
                  description="Publish the first video and shape the feed."
                  actionLabel="Publish video"
                  onAction={() => (window.location.href = "/videos/publish")}
                />
              </div>
            )}
            {!isLoading &&
              videos.map((video) => (
                <Link key={video._id} to={`/videos/${video._id}`}>
                  <Card className="group h-full transition hover:-translate-y-1 hover:shadow-glow">
                    <div className="surface-media h-40 overflow-hidden rounded-[16px] sm:h-44 lg:h-40 xl:h-44 2xl:h-56">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold text-ink-900 sm:text-xl 2xl:text-2xl">
                        {video.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-ink-500 2xl:text-base">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-ink-500 2xl:text-sm">
                        <span>{formatNumber(video.views)} views</span>
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </section>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters panel"
          />
          <div className="absolute left-0 top-0 h-full w-[min(88vw,380px)] p-3 sm:w-[min(72vw,420px)] lg:w-[min(52vw,430px)]">
            <div className="h-full overflow-y-auto rounded-[20px]">
              {filtersPanel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


