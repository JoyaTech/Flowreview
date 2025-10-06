import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FilterControls } from './components/FilterControls';
import { ReviewList } from './components/ReviewList';
import { MOCK_REVIEWS } from './constants';
import type { Review } from './types';

export type FilterType = 'all' | 'needsReply';

function App() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState<FilterType>('all');

  const handleUpdateReview = (updatedReview: Review) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const filteredReviews = useMemo(() => {
    if (filter === 'needsReply') {
      return reviews.filter(review => review.needsReply);
    }
    return reviews;
  }, [reviews, filter]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8">
        <Dashboard reviews={reviews} />
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
          <FilterControls currentFilter={filter} onFilterChange={setFilter} />
          <div className="mt-6">
            <ReviewList reviews={filteredReviews} onUpdateReview={handleUpdateReview} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
