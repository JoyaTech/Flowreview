
export interface Review {
  id: number;
  platform: 'google';
  authorName: string;
  rating: number;
  reviewText: string;
  reviewUrl: string;
  needsReply: boolean;
  repliedAt: string | null;
  replyText: string | null;
}
