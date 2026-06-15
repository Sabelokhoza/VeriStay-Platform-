import { BadgeCheck } from 'lucide-react';
import React from 'react';

function Benefits({ points, color }: { points: string[]; color: string }) {
  return (
    <div className="flex flex-row justify-center items-center w-full gap-8">
      {points.map((point, index) => (
        <div key={index} className="flex flex-col items-center text-center w-full">
          <BadgeCheck className="w-14 h-14" style={{ color }} />
          <span className="dark:text-gray-100 text-gray-800 mt-2">{point}</span>
        </div>
      ))}
    </div>
  );
}

export default Benefits;
