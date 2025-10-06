import React, { useState, useEffect } from 'react';
import type { Review } from '../types';
import { generateResponses, generateReviewSummary } from '../services/geminiService';
import { GoogleIcon, StarIcon, MagicWandIcon, CheckCircleIcon, LightBulbIcon } from './IconComponents';
import { Spinner } from './Spinner';
import { SuggestedResponse } from './SuggestedResponse';

interface ReviewItemProps {
  review: Review;
  onUpdateReview: (review: Review) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
      />
    ))}
  </div>
);

export const ReviewItem: React.FC<ReviewItemProps> = ({ review, onUpdateReview }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [editedResponse, setEditedResponse] = useState('');

  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsGeneratingSummary(true);
      setSummaryError(null);
      try {
        const generatedSummary = await generateReviewSummary(review.reviewText);
        setSummary(generatedSummary);
      } catch (err) {
        setSummaryError("Couldn't load AI summary.");
      } finally {
        setIsGeneratingSummary(false);
      }
    };
    fetchSummary();
  }, [review.reviewText]);

  const handleGenerateResponses = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedResponses([]);
    setSelectedResponse(null);

    try {
      const responses = await generateResponses(review);
      setSuggestedResponses(responses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResponse = (response: string) => {
    setSelectedResponse(response);
    setEditedResponse(response);
  };

  const handlePostReply = () => {
    const updatedReview: Review = {
      ...review,
      replyText: editedResponse,
      repliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      needsReply: false,
    };
    onUpdateReview(updatedReview);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-slate-100 p-2 rounded-full">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{review.authorName}</p>
              <StarRating rating={review.rating} />
            </div>
          </div>
          {!review.needsReply && (
             <div className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Replied
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm">
          {isGeneratingSummary ? (
            <div className="bg-slate-100 p-3 rounded-md border border-slate-200 text-slate-500 italic">Generating AI summary...</div>
          ) : summaryError ? (
            <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 italic">{summaryError}</div>
          ) : summary ? (
             <div className="bg-indigo-50 p-3 rounded-md border border-indigo-200 flex items-start space-x-3">
               <LightBulbIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
               <div>
                <strong className="font-semibold text-indigo-900">AI Sentiment Summary:</strong>
                <span className="text-slate-700 ml-1">{summary}</span>
               </div>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-slate-600 italic">"{review.reviewText}"</p>
      </div>

      {review.needsReply ? (
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          {!selectedResponse && (
            <button
              onClick={handleGenerateResponses}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
              <MagicWandIcon className="h-5 w-5 mr-2" />
              {isLoading ? 'Generating Responses...' : 'Generate AI Response'}
            </button>
          )}

          {isLoading && <div className="flex justify-center items-center h-24"><Spinner /></div>}
          
          {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

          {suggestedResponses.length > 0 && !selectedResponse && (
            <div className="mt-4">
              <h4 className="font-semibold text-slate-700 mb-2">Suggested Responses:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedResponses.map((resp, index) => (
                  <SuggestedResponse key={index} text={resp} onSelect={() => handleSelectResponse(resp)} />
                ))}
              </div>
            </div>
          )}

          {selectedResponse && (
            <div>
              <h4 className="font-semibold text-slate-700 mb-2">Edit & Post Reply:</h4>
              <textarea
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                rows={5}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <div className="mt-4 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Back to Suggestions
                </button>
                <button
                  onClick={handlePostReply}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">Your Reply <span className="text-slate-500 font-normal text-sm">({review.repliedAt})</span>:</h4>
          <p className="text-slate-600">{review.replyText}</p>
        </div>
      )}
    </div>
  );
};