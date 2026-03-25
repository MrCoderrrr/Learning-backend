import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { videoApi } from "../lib/api";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useTheme } from "../context/ThemeContext";

export default function ProfileView() {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const { data } = useQuery({
    queryKey: ["profile-videos", user?._id],
    queryFn: () =>
      videoApi.list({
        userId: user?._id,
        page: 1,
        limit: 24,
        sortBy: "createdAt",
        sortType: "desc",
      }),
    enabled: Boolean(user?._id),
  });

  const videos = data?.videos ?? [];

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
                {user?.description || "Add a short channel description for your audience."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleTheme}>
              {isDarkMode ? "Disable dark mode" : "Enable dark mode"}
            </Button>
            <Link to="/profile/edit">
              <Button variant="outline">Edit profile</Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink-900">
              Uploaded videos
            </h2>
            <p className="text-ink-500">
              Everything published from this channel.
            </p>
          </div>
          <Link to="/videos/publish">
            <Button>Upload video</Button>
          </Link>
        </div>

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
