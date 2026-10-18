interface Props {
  name: string
  className?: string
}

/** Hand-drawn inline SVG icon set — stroke-based, 24x24. */
const paths: Record<string, JSX.Element> = {
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 1.5v3M15 1.5v3M9 19.5v3M15 19.5v3M1.5 9h3M1.5 15h3M19.5 9h3M19.5 15h3" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5l7.5 3v6c0 4.8-3.2 8.4-7.5 10-4.3-1.6-7.5-5.2-7.5-10v-6z" />
      <path d="M9 11.6l2.2 2.2 4-4.2" />
    </>
  ),
  cloud: (
    <>
      <path d="M6.5 18.5a4.5 4.5 0 01-.4-9A6 6 0 0117.7 8a4.8 4.8 0 01-.7 10.5z" />
      <path d="M12 12v6M9.5 15.5L12 18l2.5-2.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.5 8.5l-2.2 5-5 2.2 2.2-5z" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M8 21h8M12 6l-6 2 6-2 6 2" />
      <path d="M6 8l-2.5 6a3 3 0 005 0L6 8zM18 8l-2.5 6a3 3 0 005 0L18 8z" />
    </>
  ),
  cycle: (
    <>
      <path d="M4 12a8 8 0 0113.7-5.6L20 8.5" />
      <path d="M20 3.5v5h-5" />
      <path d="M20 12a8 8 0 01-13.7 5.6L4 15.5" />
      <path d="M4 20.5v-5h5" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.5l1.8 6.2 6.2 1.8-6.2 1.8L12 18.5l-1.8-6.2-6.2-1.8 6.2-1.8z" />
      <path d="M19 15.5l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8z" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21.5V4" />
      <path d="M5 4.5c4-2.4 7 2 12 0v9c-5 2-8-2.4-12 0" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="1.4" />
      <path d="M12 12l6.5-6.5" />
    </>
  ),
}

export default function Icon({ name, className = 'h-5 w-5' }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.radar}
    </svg>
  )
}
