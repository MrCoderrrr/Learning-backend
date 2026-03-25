import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { authApi, subscriptionApi, videoApi } from "../lib/api";
import { Card } from "../components/Card";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Channel() {
  const { username } = useParams();
  const { push } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const { data: channel, refetch } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => authApi.getChannelProfile(username as string),
    enabled: Boolean(username),
  });

  const { data: videosData } = useQuery({
    queryKey: ["channel-videos", channel?._id],
    queryFn: () =>
      videoApi.list({
        userId: channel?._id,
        page: 1,
        limit: 24,
        sortBy: "createdAt",
        sortType: "desc",
      }),
    enabled: Boolean(channel?._id),
  });

  const toggleMutation = useMutation({
    mutationFn: () => subscriptionApi.toggle(channel?._id),
    onSuccess: () => {
      push({ title: "Subscription updated", tone: "success" });
      refetch();
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", user._id] });
        queryClient.invalidateQueries({ queryKey: ["subscribers", user._id] });
      }
    },
  });

  if (!channel) {
    return <Card>Loading channel...</Card>;
  }

  const videos = videosData?.videos ?? [];
  const canToggle = Boolean(channel._id && user?._id !== channel._id);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0">
        {channel.coverImage ? (
          <div className="surface-media h-56 w-full">
            <img
              src={channel.coverImage}
              alt={`${channel.fullName} cover`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="surface-media h-56 w-full bg-gradient-to-r from-accent-purple/20 via-accent-pink/20 to-accent-cyan/20" />
        )}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <img
                src={channel.avatar || "https://placehold.co/112x112"}
                className="-mt-14 h-28 w-28 rounded-full border-4 border-sand-50 object-cover shadow-soft"
              />
              <div className="md:pb-2">
                <h1 className="text-4xl font-semibold text-ink-900">
                  {channel.fullName}
                </h1>
                <p className="text-lg text-ink-500">@{channel.username}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
                  {channel.description || "No channel description yet."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={toggleTheme}
                className="rounded-[16px] border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-ink-900 transition hover:bg-white/10"
              >
                {isDarkMode ? "Disable dark mode" : "Enable dark mode"}
              </button>
              {canToggle && (
                <button
                  onClick={() => toggleMutation.mutate()}
                  className={[
                    "rounded-[16px] px-5 py-2 text-sm font-semibold transition",
                    channel.isSubscribed
                      ? "bg-ink-300 text-sand-50"
                      : "bg-ember-500 text-sand-50 hover:bg-ember-600",
                  ].join(" ")}
                >
                  {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="text-center">
          <p className="text-sm text-ink-500">Subscribers</p>
          <p className="text-2xl font-semibold text-ink-900">
            {channel.subscribersCount}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-ink-500">Following</p>
          <p className="text-2xl font-semibold text-ink-900">
            {channel.channelsSubscribedToCount}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-ink-500">Contact</p>
          <p className="text-ink-900">{channel.email}</p>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold text-ink-900">
          Uploaded videos
        </h2>
        {videos.length === 0 ? (
          <div className="surface-box rounded-[16px] p-6">
            <p className="text-ink-500">No uploaded videos yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video: any) => (
              <Link key={video._id} to={`/videos/${video._id}`}>
                <div className="surface-box overflow-hidden rounded-[16px] p-0">
                  <div className="surface-media h-44 w-full">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-semibold text-ink-900">
                      {video.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                      {video.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
