import React from 'react';
import type { Review } from '../types';
import { ChatBubbleLeftRightIcon, StarIcon, InboxStackIcon } from './IconComponents';

interface DashboardProps {
  reviews: Review[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex items-center space-x-4">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
  const repliesNeeded = reviews.filter(review => review.needsReply).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-sky-700" />}
        label="Total Reviews"
        value={totalReviews}
        color="bg-sky-100"
      />
      <StatCard 
        icon={<StarIcon className="h-6 w-6 text-amber-600" />}
        label="Average Rating"
        value={averageRating}
        color="bg-amber-100"
      />
      <StatCard 
        icon={<InboxStackIcon className="h-6 w-6 text-red-600" />}
        label="Replies Needed"
        value={repliesNeeded}
        color="bg-red-100"
      />
    </div>
  );
};