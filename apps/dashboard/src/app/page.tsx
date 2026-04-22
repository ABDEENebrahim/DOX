import { Sidebar } from '../components/Sidebar';
import { ActivityFeed } from '../components/ActivityFeed';
import { KPIPanel } from '../components/KPIPanel';

export default function AdminPage() {
  return (
    <main className="layout">
      <Sidebar />
      <ActivityFeed />
      <KPIPanel />
    </main>
  );
}
