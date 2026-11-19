export function ProfileBannerArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 130"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <g className="text-brand-navy dark:text-brand-cream">
        <path
          d="M22 118c-8-16-4-34 10-46 8 18 4 35-10 46Z"
          fill="currentColor"
          opacity="0.16"
        />
        <path
          d="M34 120c-5-13-1-27 9-36 5 14 2 27-9 36Z"
          fill="currentColor"
          opacity="0.1"
        />
        <path
          d="M282 114c7-14 4-28-8-37-6 15-2 29 8 37Z"
          fill="currentColor"
          opacity="0.14"
        />
        <path
          d="M296 118c5-11 2-23-6-30-4 12-1 23 6 30Z"
          fill="currentColor"
          opacity="0.09"
        />

        <rect
          x="168"
          y="92"
          width="118"
          height="15"
          rx="4"
          fill="currentColor"
          opacity="0.9"
        />
        <rect
          x="178"
          y="78"
          width="100"
          height="14"
          rx="4"
          fill="#f4ede0"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.95"
        />
        <rect
          x="186"
          y="64"
          width="88"
          height="14"
          rx="4"
          fill="#ff6858"
          opacity="0.9"
        />

        <path d="M246 8 306 34l-60 26-60-26 60-26Z" fill="currentColor" />
        <path
          d="M214 44v16c0 7 14 12 32 12s32-5 32-12V44l-32 14-32-14Z"
          fill="currentColor"
          opacity="0.92"
        />
        <circle cx="246" cy="34" r="4" fill="#ff6858" />
        <path
          d="M246 34c14 2 32 8 44 14v12"
          stroke="#ff6858"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="290" cy="63" r="4" fill="#ff6858" />
      </g>

      <g stroke="#ff6858" strokeWidth="4" strokeLinecap="round">
        <path d="M126 20l13-8" />
        <path d="M138 30l16-2" />
        <path d="M120 33l6 12" />
      </g>
    </svg>
  )
}
