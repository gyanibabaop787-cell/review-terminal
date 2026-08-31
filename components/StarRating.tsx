"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  onRating: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ onRating, disabled = false }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    if (disabled) return;
    setRating(value);
    onRating(value);
  };

  return (
    <div className="flex justify-center gap-4 mt-8 mb-8">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn"
          disabled={disabled}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
        >
          <Star
            className={`star-icon ${star <= (hover || rating) ? 'active' : ''}`}
          />
        </button>
      ))}
    </div>
  );
}
