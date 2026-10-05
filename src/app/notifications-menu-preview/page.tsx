import { NotificationsMenu } from "@/components/shared/notifications-menu";

export default async function NotificationsMenuPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const params = await searchParams;
  const isEmpty = params.empty === "true";
  
  return (
    <div className="min-h-screen bg-background flex items-start justify-end p-8">
      <NotificationsMenu isEmpty={isEmpty} />
    </div>
  );
}
