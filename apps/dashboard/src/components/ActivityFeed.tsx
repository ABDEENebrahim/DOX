'use client';

import { useEffect, useState } from 'react';

interface Activity {
  eventType: string;
  source: string;
  createdAt: string;
  traceId: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export function ActivityFeed() {
  const [events, setEvents] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/activity/feed?limit=20`)
      .then((res) => res.json())
      .then((data) => setEvents(data.items || []))
      .catch(() => setEvents([]));

    const source = new EventSource(`${API_BASE}/activity/stream`);
    source.onmessage = (evt) => {
      const payload = JSON.parse(evt.data) as Activity;
      setEvents((prev) => [payload, ...prev].slice(0, 30));
    };

    return () => source.close();
  }, []);

  return (
    <section className="panel">
      <h3>Live AI Activity</h3>
      {events.map((event) => (
        <div className="feed-item" key={event.traceId + event.createdAt}>
          <div className="badge">{event.eventType}</div>
          <div>{event.source}</div>
          <small>{new Date(event.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </section>
  );
}
