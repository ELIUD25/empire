import React, { useState, useEffect } from 'react';
import { Target, Trophy, TrendingUp, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface BettingTip {
  _id: string;
  match: string;
  league: string;
  time: string;
  prediction: string;
  odds: string;
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
  date: string;
  createdAt: string;
}

const BettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'predictions' | 'results' | 'analysis'
  >('predictions');
  const [bettingTips, setBettingTips] = useState<BettingTip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBettingTips();
  }, []);

  const fetchBettingTips = async () => {
    try {
      setLoading(true);
      const tips = await apiService.getBettingTips();
      setBettingTips(tips);
    } catch (error) {
      console.error('Failed to fetch betting tips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = [
    {
      label: 'Win Rate',
      value: '85%',
      color: 'text-green-400',
    },
    {
      label: 'Total Tips',
      value: bettingTips.length.toString(),
      color: 'text-blue-400',
    },
    {
      label: 'This Month',
      value: bettingTips
        .filter((tip) => {
          const tipDate = new Date(tip.createdAt);
          const now = new Date();
          return (
            tipDate.getMonth() === now.getMonth() &&
            tipDate.getFullYear() === now.getFullYear()
          );
        })
        .length.toString(),
      color: 'text-yellow-400',
    },
    {
      label: 'High Confidence',
      value: bettingTips
        .filter((tip) => tip.confidence === 'High')
        .length.toString(),
      color: 'text-purple-400',
    },
  ];

  // Tab configuration
  const tabs = [
    { id: 'predictions', label: "Today's Predictions", icon: Target },
    { id: 'results', label: 'Recent Results', icon: Trophy },
    { id: 'analysis', label: 'Expert Analysis', icon: TrendingUp },
  ];

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <Target className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Betting Tips Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to access professional betting predictions!
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-3 rounded-lg font-semibold transition-all">
              Activate Account - 500 KES
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <Target className="h-10 w-10 text-blue-400" />
            <span>Betting Predictions</span>
          </h1>
          <p className="text-xl text-gray-300">
            Professional betting tips with high accuracy rates
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
            >
              <p className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab === 'predictions' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Today's Predictions
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                </div>
              ) : bettingTips.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Predictions Available
                  </h3>
                  <p className="text-gray-300">
                    Check back later for new betting predictions from our
                    experts.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bettingTips.map((prediction) => (
                    <div
                      key={prediction._id}
                      className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {prediction.match}
                            </h3>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                              {prediction.league}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{prediction.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star
                                className={`h-4 w-4 ${
                                  prediction.confidence === 'High'
                                    ? 'text-green-400'
                                    : prediction.confidence === 'Medium'
                                      ? 'text-yellow-400'
                                      : 'text-red-400'
                                }`}
                              />
                              <span
                                className={
                                  prediction.confidence === 'High'
                                    ? 'text-green-400'
                                    : prediction.confidence === 'Medium'
                                      ? 'text-yellow-400'
                                      : 'text-red-400'
                                }
                              >
                                {prediction.confidence} Confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                          <div className="text-center">
                            <p className="text-sm text-gray-300">Prediction</p>
                            <p className="text-lg font-semibold text-white">
                              {prediction.prediction}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-300">Odds</p>
                            <p className="text-xl font-bold text-green-400">
                              {prediction.odds}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-gray-300 mb-1">Analysis:</p>
                        <p className="text-white">{prediction.analysis}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Recent Results
              </h2>
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Results Coming Soon
                </h3>
                <p className="text-gray-300">
                  Results will appear here once predictions are completed.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Expert Analysis
              </h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Weekly Market Overview
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Our expert analysis team provides comprehensive insights
                    into upcoming matches and betting trends. Stay informed with
                    the latest market movements and betting opportunities.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-2">
                        Key Trends
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Home advantage showing strong correlation</li>
                        <li>• Over 2.5 goals trending in major leagues</li>
                        <li>• Defensive teams performing well</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-lg font-medium text-white mb-2">
                        Hot Tips
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Focus on team form over reputation</li>
                        <li>• Weather conditions affecting totals</li>
                        <li>• Injury reports crucial for lineups</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Bankroll Management Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-400 font-bold">1%</span>
                      </div>
                      <p className="text-white font-medium">Unit Size</p>
                      <p className="text-sm text-gray-300">
                        Never bet more than 1-2% of your bankroll per bet
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-400 font-bold">5</span>
                      </div>
                      <p className="text-white font-medium">Max Bets</p>
                      <p className="text-sm text-gray-300">
                        Limit yourself to 5 bets per day maximum
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-400 font-bold">ROI</span>
                      </div>
                      <p className="text-white font-medium">Track ROI</p>
                      <p className="text-sm text-gray-300">
                        Monitor your return on investment consistently
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettingPage;
