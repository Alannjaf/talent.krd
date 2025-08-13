"use client";

import { useEffect, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function MouseTrail() {
  const [trails, setTrails] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);

      const newTrail: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: trailId++,
      };

      setTrails((prev) => {
        const updated = [newTrail, ...prev];
        return updated.slice(0, 20); // Keep only last 20 points
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTrails([]);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute w-3 h-3 rounded-full mouse-trail"
          style={{
            left: trail.x - 6,
            top: trail.y - 6,
            background: `linear-gradient(135deg, 
              rgba(99, 102, 241, ${0.8 - index * 0.04}) 0%, 
              rgba(168, 85, 247, ${0.6 - index * 0.03}) 50%, 
              rgba(236, 72, 153, ${0.4 - index * 0.02}) 100%)`,
            transform: `scale(${1 - index * 0.05})`,
            animation: `mouseTrailFade 0.8s ease-out forwards`,
            animationDelay: `${index * 0.02}s`,
          }}
        />
      ))}
    </div>
  );
}
