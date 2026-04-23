"use client";

import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>;

export default function FallingText({ children, className = '', style }: Props) {
  const text = typeof children === 'string' ? children : String(children);
  const words = text.split(/(\s+)/).filter(Boolean);

  return (
    <p className={className} style={style} aria-hidden={false}>
      {words.map((w, i) => (
        <span
          key={i}
          className="falling-word"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {w}
        </span>
      ))}
    </p>
  );
}
