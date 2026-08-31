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
    // Allow deselecting if clicking the exact same rating
    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    onRating(newRating);
  };

  return (
    <div className="flex justify-between items-center w-full px-2 mt-4 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-btn flex-1 flex justify-center py-2"
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
