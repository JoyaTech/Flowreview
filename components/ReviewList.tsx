
import React from 'react';
import { ReviewItem } from './ReviewItem';
import type { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  onUpdateReview: (review: Review) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, onUpdateReview }) => {
  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <ReviewItem key={review.id} review={review} onUpdateReview={onUpdateReview} />
      ))}
    </div>
  );
};
