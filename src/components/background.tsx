"use client";

export default function BackGround() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-100 dark:bg-[#000000] transition duration-300">
      <div className="blob bg-blue-200 dark:bg-blue-900 opacity-30 dark:opacity-25 transition duration-300"></div>
      <div className="blob bg-cyan-200 dark:bg-cyan-900 opacity-30 dark:opacity-25 transition duration-300"></div>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.0" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <pattern id="cyber-grid" width="170" height="170" patternUnits="userSpaceOnUse">
            <g stroke="var(--cyber-color)" strokeWidth="1.5" filter="url(#glow)">
              <line x1="10" y1="5" x2="10" y2="15" />
              <line x1="5" y1="10" x2="15" y2="10" />
            </g>
            {[...Array(6)].map((_, i) =>
              [...Array(6)].map((_, j) => (
                <circle
                  key={`dot-${i}-${j}`}
                  cx={27 + i * 27}
                  cy={27 + j * 27}
                  r="1.0"
                  fill="var(--cyber-color)"
                  filter="url(#glow)"
                  opacity="0.5"
                />
              ))
            )}
          </pattern>
        </defs>
        <rect width="160%" height="160%" fill="url(#cyber-grid)" opacity="1.0" />
      </svg>
    </div>
  );
}

