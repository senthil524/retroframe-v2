import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = '', linkTo = '/' }) {
  return (
    <Link to={linkTo} className={`flex items-center gap-1 ${className}`}>
      <img
        src="/icon-colored.png"
        alt="RetroFrame"
        className="w-8 h-8 md:w-10 md:h-10"
      />
      <span
        className="text-xl md:text-2xl"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dark)' }}
      >
        RetroFrame
      </span>
    </Link>
  );
}
