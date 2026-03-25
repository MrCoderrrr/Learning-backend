import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";

export default function Subscribers() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["subscribers", user?._id],
    queryFn: () => subscriptionApi.subscribers(user?._id as string),
    enabled: Boolean(user?._id),
  });

  const subscribers = data ?? [];

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold text-ink-900">Subscribers</h1>
      {subscribers.length === 0 && (
        <EmptyState
          title="No subscribers yet"
          description="Share your channel to grow your audience."
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {subscribers.map((item: any) => (
          <div
            key={item._id}
            className="surface-box flex items-center gap-3 rounded-[16px] p-4"
          >
            <img
              src={item.subscriber?.avatar || "https://placehold.co/64x64"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-ink-900">
                {item.subscriber?.fullName || item.subscriber?.username}
              </p>
              <p className="text-sm text-ink-500">
                @{item.subscriber?.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
