import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="panel">
      <h3>JARVIS OS</h3>
      <Link className="nav-item" href="/">Admin Dashboard</Link>
      <Link className="nav-item" href="/investor">Investor Dashboard</Link>
      <Link className="nav-item" href="/">Live Feed</Link>
      <Link className="nav-item" href="/">Appointments</Link>
      <Link className="nav-item" href="/">Revenue</Link>
    </aside>
  );
}
