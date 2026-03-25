import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tweetApi, apiHelpers } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "../components/Toast";
import { formatDate } from "../lib/utils";

export default function Tweets() {
  const { user } = useAuth();
  const { push } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const { data } = useQuery({
    queryKey: ["tweets", user?._id],
    queryFn: () => tweetApi.listByUser(user?._id as string),
    enabled: Boolean(user?._id),
  });

  const createMutation = useMutation({
    mutationFn: () => tweetApi.create({ content }),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
    onError: (error) =>
      push({
        title: "Tweet failed",
        description: apiHelpers.getErrorMessage(
          error,
          "Your update could not be posted. Please review the text and try again."
        ),
        tone: "error",
      }),
  });

  const updateMutation = useMutation({
    mutationFn: () => tweetApi.update(editingId as string, { content: editingText }),
    onSuccess: () => {
      setEditingId(null);
      setEditingText("");
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (tweetId: string) => tweetApi.delete(tweetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] }),
  });

  const tweets = data ?? [];

  return (
    <div className="space-y-8">
      <Card className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink-900">Studio tweets</h1>
        <Input
          label="New tweet"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <Button onClick={() => createMutation.mutate()}>Post update</Button>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-2xl font-semibold text-ink-900">Your updates</h2>
        {tweets.map((tweet: any) => (
          <div
            key={tweet._id}
            className="surface-box rounded-[16px] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-ink-500">{formatDate(tweet.createdAt)}</p>
                {editingId === tweet._id ? (
                  <Input
                    label="Edit tweet"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                ) : (
                  <p className="mt-2 text-ink-900">{tweet.content}</p>
                )}
              </div>
              <div className="flex gap-2">
                {editingId === tweet._id ? (
                  <Button onClick={() => updateMutation.mutate()}>Save</Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(tweet._id);
                      setEditingText(tweet.content);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button variant="ghost" onClick={() => deleteMutation.mutate(tweet._id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
