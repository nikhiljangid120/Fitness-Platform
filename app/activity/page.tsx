import { NotificationsPanel } from "@/components/notifications-panel"

export default function ActivityPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Activity</h1>
      <NotificationsPanel />
    </div>
  )
}

