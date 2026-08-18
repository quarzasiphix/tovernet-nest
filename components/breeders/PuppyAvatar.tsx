type PuppyAvatarProps = {
  className?: string;
  color?: string;
};

// Clean illustrated dog-face avatar, replacing the 🐕 emoji placeholder.
export default function PuppyAvatar({ className, color = '#db2777' }: PuppyAvatarProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 10c-3 0-5 3-4.5 7 .3 2.5 1.8 4.5 3.5 5.5L14 16l1-6z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M34 10c3 0 5 3 4.5 7-.3 2.5-1.8 4.5-3.5 5.5L34 16l-1-6z"
        fill={color}
        opacity="0.85"
      />
      <circle cx="24" cy="26" r="13" fill={color} />
      <circle cx="18.5" cy="24" r="1.8" fill="white" />
      <circle cx="29.5" cy="24" r="1.8" fill="white" />
      <ellipse cx="24" cy="29.5" rx="3" ry="2.2" fill="white" />
      <path
        d="M24 31.5c-1 1.4-2.5 2-4 1.6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 31.5c1 1.4 2.5 2 4 1.6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
