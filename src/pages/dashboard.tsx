"use client";
import { useEffect, useState } from "react";

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/api/sports")
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        ⚽ Sports Predictions Dashboard
      </h1>
      <div className="grid gap-4">
        {matches.map((match) => (
          <div key={match.id} className="p-4 border rounded-lg shadow bg-white">
            <p className="font-semibold">
              {match.home} vs {match.away}
            </p>
            <p className="text-blue-600">{match.prediction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
