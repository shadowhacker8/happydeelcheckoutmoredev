import React, { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2, X } from 'lucide-react';

// Real-sounding review data focused on deals and savings
const reviewsData = [
  {
    id: 1,
    author: 'Mike Thompson',
    avatar: 'https://i.ibb.co/SDVn9ZXz/i-2.webp',
    rating: 5,
    date: '2 months ago',
    title: 'Found an amazing deal on a Canon G7X',
    content: "I've been watching the G7X Mark III prices for months, and HappyDeel had it for $200 less than anywhere else. Shipping was quick, and the camera works perfectly. These guys really do find the best deals - I'm definitely coming back for my next camera purchase.",
    helpful: 24,
    verified: true,
    location: 'Chicago, IL',
    purchaseDate: '1 month ago'
  },
  {
    id: 2,
    author: 'Sarah Miller',
    avatar: 'https://i.ibb.co/4w8W5qG8/icon-7797704-640.png',
    rating: 4,
    date: '3 weeks ago',
    title: 'Great prices, just watch the stock levels',
    content: "Got my Sony A7 IV for an unbeatable price - saved almost $400 compared to other stores. The only reason for 4 stars instead of 5 is that some deals sell out super fast. You've got to be quick! But when you do catch a deal, it's totally worth it. Customer service was really helpful when I had questions about shipping.",
    helpful: 15,
    verified: true,
    location: 'Austin, TX',
    purchaseDate: '2 months ago'
  },
  {
    id: 3,
    author: 'David Chen',
    avatar: 'https://i.ibb.co/Vc3Fwczr/441951984-8112491162147601-7494370901928224580-n.jpg',
    rating: 5,
    date: '1 month ago',
    title: 'Best prices for quality electronics',
    content: "I was skeptical about the prices at first - they seemed too good to be true. But HappyDeel is legit! Bought a refurbished Fujifilm X-T5 that looks and works like new, saved over $500. They really do snipe the best deals. The detailed product descriptions and condition ratings are spot-on. Already recommended to my photography group!",
    helpful: 32,
    verified: true,
    location: 'Seattle, WA',
    purchaseDate: '3 months ago'
  }
];

const Reviews = ({ productSlug }) => {
  const [sortBy, setSortBy] = useState('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    name: '',
    email: '',
    location: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [helpfulClicks, setHelpfulClicks] = useState({});
  
  const averageRating = 4.7;
  const totalReviews = reviewsData.length;
  const ratingDistribution = {
    5: 75,
    4: 20,
    3: 3,
    2: 1,
    1: 1
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setShowReviewForm(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    setNewReview({
      rating: 5,
      title: '',
      content: '',
      name: '',
      email: '',
      location: ''
    });
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulClicks(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Reviews Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Rating Summary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'text-[#0046be] fill-[#0046be]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-grow max-w-sm">
            {Object.entries(ratingDistribution).reverse().map(([rating, percentage]) => (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-grow bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#0046be] rounded-full h-2" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">{percentage}%</span>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <button 
            onClick={() => setShowReviewForm(true)}
            className="bg-[#0046be] hover:bg-[#003494] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="border-b border-gray-200 p-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0046be]"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {reviewsData.map(review => (
          <div key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <img 
                src={review.avatar} 
                alt={review.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      {review.author}
                      {review.verified && (
                        <span className="flex items-center text-[#0046be] text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Verified Purchase
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {review.location} • Purchased {review.purchaseDate}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>

                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-[#0046be] fill-[#0046be]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <h4 className="font-medium text-gray-900 mt-2">{review.title}</h4>
                <p className="mt-2 text-gray-600">{review.content}</p>

                <div className="mt-4">
                  <button 
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`flex items-center ${helpfulClicks[review.id] ? 'text-[#0046be]' : 'text-gray-500 hover:text-[#0046be]'} transition-colors duration-300`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>Helpful ({helpfulClicks[review.id] ? review.helpful + 1 : review.helpful})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Write a Review</h3>
              <button 
                onClick={() => setShowReviewForm(false)}
                className="text-gray-500 hover:text-[#0046be] transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-8 w-8 ${i < newReview.rating ? 'text-[#0046be] fill-[#0046be]' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Review Title</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  required
                />
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  required
                />
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={newReview.location}
                  onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0046be]"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0046be] hover:bg-[#003494] text-white py-3 rounded-lg font-medium transition-colors duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Your review has been submitted successfully!
        </div>
      )}
    </div>
  );
};

export default Reviews;