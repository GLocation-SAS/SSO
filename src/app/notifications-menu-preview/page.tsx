import { NotificationsMenu } from "@/components/shared/notifications-menu";

export default function NotificationsMenuPreviewPage() {
  const isEmpty = false;
  
  return (
    <div className="min-h-screen bg-background flex items-start justify-end p-8">
      <NotificationsMenu isEmpty={isEmpty} />
    </div>
  );
}
