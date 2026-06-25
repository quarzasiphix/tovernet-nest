'use client';

import posthog from 'posthog-js';
import { AnchorHTMLAttributes } from 'react';

interface TrackedAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: string;
  eventProperties?: Record<string, unknown>;
}

export default function TrackedAnchor({
  eventName,
  eventProperties,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    posthog.capture(eventName, eventProperties);
    onClick?.(e);
  };

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
