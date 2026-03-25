import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi, likeApi, videoApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Skeleton } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import { formatDate, formatNumber } from "../lib/utils";

export default function VideoDetail() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { push } = useToast();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerShellRef = useRef<HTMLDivElement | null>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => videoApi.get(videoId as string),
    enabled: Boolean(videoId),
  });

  const { data: commentData } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => commentApi.list(videoId as string, { page: 1, limit: 30 }),
    enabled: Boolean(videoId),
  });

  const comments = useMemo(
    () => commentData?.docs ?? commentData?.comments ?? [],
    [commentData]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      const player = videoRef.current;
      const playerShell = playerShellRef.current;

      if (!player) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === " ") {
        event.preventDefault();
        if (player.paused) {
          void player.play();
        } else {
          player.pause();
        }
        return;
      }

      if (key === "m") {
        event.preventDefault();
        player.muted = !player.muted;
        return;
      }

      if (key === "f") {
        event.preventDefault();
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else if (playerShell?.requestFullscreen) {
          void playerShell.requestFullscreen();
        } else if (player.requestFullscreen) {
          void player.requestFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const likeMutation = useMutation({
    mutationFn: () => likeApi.toggleVideo(videoId as string),
    onSuccess: () => {
      setLiked((prev) => !prev);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: () => commentApi.add(videoId as string, { content: comment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: () => videoApi.delete(videoId as string),
    onSuccess: () => {
      push({ title: "Video deleted", tone: "info" });
      navigate("/");
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: () => videoApi.togglePublish(videoId as string),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["video", videoId] }),
  });

  const { data: otherVideosData } = useQuery({
    queryKey: ["otherVideos"],
    queryFn: () => videoApi.list({ page: 1, limit: 12 }),
  });

  const otherVideos = useMemo(() => {
    const list = otherVideosData?.videos || otherVideosData?.docs || [];
    return list.filter((v: any) => v._id !== videoId);
  }, [otherVideosData, videoId]);

  if (isLoading || !video) {
    return (
      <Card>
        <Skeleton className="h-64" />
        <Skeleton className="mt-4 h-6 w-1/2" />
      </Card>
    );
  }

  const isOwner =
    user && video.owner && (video.owner._id || video.owner) === user._id;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="flex-1 space-y-8">
        <Card className="space-y-4">
          <div
            ref={playerShellRef}
            className="surface-media overflow-hidden rounded-[16px]"
          >
            <video
              ref={videoRef}
              src={video.videoFile}
              controls
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-ink-900">
                {video.title}
              </h1>
              <p className="text-sm text-ink-500">
                {formatNumber(video.views)} views ·{" "}
                {formatDate(video.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => likeMutation.mutate()}
                className={[
                  "flex items-center gap-2 rounded-[16px] border px-4 py-2 text-sm font-semibold transition",
                  liked
                    ? "border-gold-500 bg-gold-500/20 text-ink-900"
                    : "border-white/10 bg-panel-900 text-ink-700 hover:border-white/20",
                ].join(" ")}
              >
                <span className={liked ? "text-gold-500" : "text-ink-500"}>
                  {liked ? "⭐" : "☆"}
                </span>
                {liked ? "Liked" : "Like"}
              </button>
              {isOwner && (
                <>
                  <Link to={`/videos/${videoId}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => togglePublishMutation.mutate()}
                  >
                    {video.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteVideoMutation.mutate()}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="text-ink-700">{video.description}</p>
          {video.owner && (
            <div className="flex items-center gap-3">
              <img
                src={video.owner.avatar || "https://placehold.co/48x48"}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-ink-900">
                  {video.owner.fullName || video.owner.username}
                </p>
                <Link
                  to={`/channel/${video.owner.username}`}
                  className="text-sm text-ink-500"
                >
                  View channel
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold text-ink-900">Comments</h2>
          <div className="flex max-w-xl flex-col gap-2">
            <Input
              label="Add a comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button
              onClick={() => addCommentMutation.mutate()}
              disabled={!comment.trim()}
              className="self-start"
            >
              Post comment
            </Button>
          </div>
          <div className="space-y-4">
            {comments.map((item: any) => (
              <div key={item._id} className="surface-box rounded-[16px] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink-900">
                      {item.owner?.fullName || item.owner?.username || "User"}
                    </p>
                    <p className="text-sm text-ink-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-ink-700">{item.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="w-full lg:w-80 xl:w-96">
        <div className="flex flex-col gap-4">
          {otherVideos.map((v: any) => (
            <Link key={v._id} to={`/videos/${v._id}`} className="group">
              <Card className="transition hover:-translate-y-1 hover:shadow-glow">
                <div className="surface-media relative aspect-video overflow-hidden rounded-[12px]">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {v.duration && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {Math.floor(v.duration / 60)}:
                      {Math.round(v.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  <h4 className="line-clamp-2 text-sm font-semibold text-ink-900 group-hover:text-gold-500">
                    {v.title}
                  </h4>
                  <div className="flex flex-col text-xs text-ink-500">
                    <span>{v.owner?.fullName || v.owner?.username}</span>
                    <span>
                      {formatNumber(v.views)} views · {formatDate(v.createdAt)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
