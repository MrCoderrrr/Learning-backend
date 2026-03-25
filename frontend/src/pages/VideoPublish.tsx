import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { videoApi, apiHelpers } from "../lib/api";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { MediaUploader } from "../components/MediaUploader";
import { useToast } from "../components/Toast";

export default function VideoPublish() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile || !thumbnail) {
        throw new Error("Video and thumbnail are required");
      }
      const payload = new FormData();
      payload.append("title", title);
      payload.append("description", description);
      payload.append("videoFile", videoFile);
      payload.append("thumbnail", thumbnail);
      return videoApi.publish(payload);
    },
    onSuccess: (data: any) => {
      push({ title: "Video published", tone: "success" });
      if (data?._id) {
        navigate(`/videos/${data._id}`);
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      push({
        title: "Publish failed",
        description: apiHelpers.getErrorMessage(
          error,
          "The video could not be published. Please make sure the video file, thumbnail, title, and description are all valid."
        ),
        tone: "error",
      });
    },
  });

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-ink-500">
          Publish
        </p>
        <h1 className="text-3xl font-semibold text-ink-900">
          Release a new story
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label="Short description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <MediaUploader
            label="Video file"
            accept="video/*"
            file={videoFile}
            onChange={setVideoFile}
          />
          <p className="text-sm text-ink-500">
            Video files must be under 100 MB.
          </p>
        </div>
        <MediaUploader
          label="Thumbnail"
          accept="image/*"
          file={thumbnail}
          onChange={setThumbnail}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending}>
          {publishMutation.isPending ? "Publishing..." : "Publish video"}
        </Button>
      </div>
    </Card>
  );
}
