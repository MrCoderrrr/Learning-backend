import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { videoApi, apiHelpers } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MediaUploader } from "../components/MediaUploader";
import { useToast } from "../components/Toast";

export default function VideoEdit() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const { data: video } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => videoApi.get(videoId as string),
    enabled: Boolean(videoId),
  });

  useEffect(() => {
    if (video) {
      setTitle(video.title ?? "");
      setDescription(video.description ?? "");
    }
  }, [video]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("description", description);
      if (thumbnail) {
        payload.append("thumbnail", thumbnail);
      }
      return videoApi.update(videoId as string, payload);
    },
    onSuccess: () => {
      push({ title: "Video updated", tone: "success" });
      navigate(`/videos/${videoId}`);
    },
    onError: (error) => {
      push({
        title: "Update failed",
        description: apiHelpers.getErrorMessage(
          error,
          "The video changes could not be saved. Please review the title, description, and thumbnail."
        ),
        tone: "error",
      });
    },
  });

  if (!video) {
    return <Card>Loading...</Card>;
  }

  return (
    <Card className="space-y-6">
      <h1 className="text-3xl font-semibold text-ink-900">Edit video</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <MediaUploader
        label="Replace thumbnail"
        accept="image/*"
        file={thumbnail}
        onChange={setThumbnail}
      />
      <div className="flex justify-end">
        <Button onClick={() => updateMutation.mutate()}>
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}
