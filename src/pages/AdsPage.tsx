import React, { useState, useEffect } from 'react';
import {
  Eye,
  DollarSign,
  Play,
  Clock,
  CheckCircle,
  Star,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface Advertisement {
  _id: string;
  title: string;
  brand: string;
  duration: number;
  reward: number;
  category: string;
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
  maxViews: number;
  currentViews: number;
}

const AdsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [watchingAd, setWatchingAd] = useState(false);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [dailyWatched, setDailyWatched] = useState(0);
  const [watchedAdIds, setWatchedAdIds] = useState<string[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (watchingAd && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && watchingAd) {
      completeAdWatch();
    }
    return () => clearInterval(interval);
  }, [watchingAd, timeRemaining]);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const ads = await apiService.getAdvertisements();
      setAdvertisements(ads);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWatchingAd = (ad: Advertisement) => {
    // Check if ad already watched
    if (watchedAdIds.includes(ad._id)) {
      alert('You have already watched this ad!');
      return;
    }

    // Check if ad has reached max views
    if (ad.currentViews >= ad.maxViews) {
      alert('This ad has reached maximum number of views!');
      return;
    }

    if (!user || user.balance < 0) {
      alert('Please ensure your account is in good standing!');
      return;
    }

    setCurrentAd(ad);
    setTimeRemaining(ad.duration);
    setWatchingAd(true);
  };

  const completeAdWatch = async () => {
    if (user && currentAd) {
      try {
        // Call API to watch advertisement
        const result = await apiService.watchAdvertisement(currentAd._id);

        // Add to watched ads list
        setWatchedAdIds((prev) => [...prev, currentAd._id]);

        // Update user balance
        updateUser({ balance: result.newBalance });
        setDailyWatched((prev) => prev + 1);

        alert(
          `Congratulations! You earned ${result.reward} KES for watching the ad!`
        );

        // Refresh advertisements to get updated view counts
        fetchAdvertisements();
      } catch (error) {
        console.error('Failed to complete ad watch:', error);
        alert('Failed to process ad watch. Please try again.');
      }
    }
    setWatchingAd(false);
    setCurrentAd(null);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAvailableAds = () => {
    return advertisements.filter(
      (ad) => !watchedAdIds.includes(ad._id) && ad.currentViews < ad.maxViews
    );
  };

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <Eye className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Ads Feature Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to start watching ads and earning 10 KES per
              ad!
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-3 rounded-lg font-semibold transition-all">
              Activate Account - 500 KES
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <Eye className="h-10 w-10 text-blue-400" />
            <span>Watch & Earn</span>
          </h1>
          <p className="text-xl text-gray-300">
            Watch targeted ads and earn rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {dailyWatched * 10} KES
            </p>
            <p className="text-gray-300">Today's Earnings</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6 text-center">
            <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">{dailyWatched}</p>
            <p className="text-gray-300">Ads Watched</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {getAvailableAds().length}
            </p>
            <p className="text-gray-300">Available</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6 text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {advertisements.length > 0 ? advertisements[0].reward : 0} KES
            </p>
            <p className="text-gray-300">Per Ad</p>
          </div>
        </div>

        {/* Ad Watching Interface */}
        {watchingAd && currentAd && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Now Watching
              </h2>
              <div className="bg-black rounded-lg p-8 mb-6 relative">
                {currentAd.type === 'video' ? (
                  <div className="relative">
                    <video
                      className="w-full h-64 object-cover rounded-lg"
                      autoPlay
                      muted
                      controls={false}
                    >
                      <source src={currentAd.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={currentAd.url}
                      alt={currentAd.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2 mt-4">
                  {currentAd.title}
                </h3>
                <p className="text-gray-300">by {currentAd.brand}</p>
              </div>
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <p className="text-green-400 font-medium">
                  Keep watching to earn {currentAd.reward} KES! Time remaining:{' '}
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Available Ads */}
        {!watchingAd && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Available Ads
            </h2>
            {getAvailableAds().length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No More Ads Available
                </h3>
                <p className="text-gray-300">
                  You have watched all available ads or they have reached their
                  view limits. Check back later for new ads!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getAvailableAds().map((ad) => (
                  <div
                    key={ad._id}
                    className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 border border-gray-400/30 rounded-lg p-6 hover:scale-105 transition-all"
                  >
                    <div className="relative mb-4">
                      <img
                        src={ad.thumbnail}
                        alt={ad.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {ad.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white bg-black/50 rounded-full p-2" />
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        {ad.category}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium ml-2">
                        {ad.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {ad.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">by {ad.brand}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">
                          {ad.duration}s
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          {ad.reward} KES
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Views</span>
                        <span>
                          {ad.currentViews}/{ad.maxViews}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(ad.currentViews / ad.maxViews) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => startWatchingAd(ad)}
                      disabled={
                        watchedAdIds.includes(ad._id) ||
                        ad.currentViews >= ad.maxViews
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {watchedAdIds.includes(ad._id) ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Already Watched</span>
                        </>
                      ) : ad.currentViews >= ad.maxViews ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>Limit Reached</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Watch Ad</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {watchedAdIds.slice(-3).map((adId, index) => {
              const ad = advertisements.find((a) => a._id === adId);
              if (!ad) return null;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-400/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <h3 className="text-white font-medium">{ad.title}</h3>
                      <p className="text-gray-400 text-sm">by {ad.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">
                      +{ad.reward} KES
                    </p>
                    <p className="text-gray-400 text-sm">Just now</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
