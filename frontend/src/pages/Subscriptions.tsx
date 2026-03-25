import { useQuery } from "@tanstack/react-query";
import { subscriptionApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";

export default function Subscriptions() {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["subscriptions", user?._id],
    queryFn: () => subscriptionApi.subscribedChannels(user?._id as string),
    enabled: Boolean(user?._id),
  });

  const channels = data ?? [];

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold text-ink-900">
        Channels you follow
      </h1>
      {channels.length === 0 && (
        <EmptyState
          title="No subscriptions yet"
          description="Follow channels to see them here."
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {channels.map((item: any) => (
          <div
            key={item._id}
            className="surface-box flex items-center gap-3 rounded-[16px] p-4"
          >
            <img
              src={item.channel?.avatar || "https://placehold.co/64x64"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-ink-900">
                {item.channel?.fullName || item.channel?.username}
              </p>
              <p className="text-sm text-ink-500">
                @{item.channel?.username}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
