import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BookOpen,
  Bell,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'; // Removed CheckCircle
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface TradingSignal {
  _id: string;
  pair: string;
  signalType: 'BUY' | 'SELL';
  entryPrice: number;
  tp1: number;
  tp2: number;
  stopLoss: number;
  pips: number;
  status: 'active' | 'hit_tp1' | 'hit_tp2' | 'stopped';
  createdAt: string;
}

interface TradingCourse {
  _id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: Array<{
    title: string;
    description: string;
    type: 'video' | 'text' | 'exam';
    content?: string;
    videoUrl?: string;
    order: number;
  }>;
}

interface MarketNews {
  _id: string;
  title: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

interface MarketAnalysis {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const TradingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signals');
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [tradingCourses, setTradingCourses] = useState<TradingCourse[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<TradingCourse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTradingData();
  }, []);

  const fetchTradingData = async () => {
    try {
      setLoading(true);
      const [signals, courses, news, analysis] = await Promise.all([
        apiService.getTradingSignals(),
        apiService.getTradingCourses(),
        apiService.getMarketNews(),
        apiService.getMarketAnalysis(),
      ]);

      setTradingSignals(signals);
      setTradingCourses(courses);
      setMarketNews(news);
      setMarketAnalysis(analysis);
    } catch (error) {
      console.error('Failed to fetch trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const winRate =
    tradingSignals.length > 0
      ? Math.round(
          (tradingSignals.filter(
            (s) => s.status === 'hit_tp1' || s.status === 'hit_tp2'
          ).length /
            tradingSignals.length) *
            100
        )
      : 0;

  const totalPips = tradingSignals.reduce(
    (sum, signal) => sum + signal.pips,
    0
  );

  const stats = [
    { label: 'Win Rate', value: `${winRate}%`, color: 'text-green-400' },
    { label: 'Total Pips', value: `+${totalPips}`, color: 'text-blue-400' },
    {
      label: 'Signals Sent',
      value: tradingSignals.length.toString(),
      color: 'text-purple-400',
    },
    { label: 'Market Coverage', value: '24/7', color: 'text-yellow-400' },
  ];

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Trading Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to access trading signals and education.
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <TrendingUp className="h-10 w-10 text-blue-400" />
            <span>Trading Services</span>
          </h1>
          <p className="text-xl text-gray-300">
            Professional forex signals and trading education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'signals', label: 'Live Signals', icon: TrendingUp },
              { id: 'education', label: 'Trading Courses', icon: BookOpen },
              { id: 'news', label: 'Market News', icon: Bell },
              { id: 'analysis', label: 'Market Analysis', icon: BarChart3 },
            ].map((tab) => (
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

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab === 'signals' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Live Trading Signals
              </h2>
              {tradingSignals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Signals Available
                  </h3>
                  <p className="text-gray-300">
                    Check back later for new trading signals.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tradingSignals.map((signal) => (
                    <div
                      key={signal._id}
                      className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-xl font-semibold text-white">
                              {signal.pair}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                                signal.signalType === 'BUY'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {signal.signalType === 'BUY' ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                              <span>{signal.signalType}</span>
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                signal.status === 'active'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : signal.status === 'hit_tp1' ||
                                      signal.status === 'hit_tp2'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {signal.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Entry</p>
                              <p className="text-white font-medium">
                                {signal.entryPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP1</p>
                              <p className="text-green-400 font-medium">
                                {signal.tp1}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP2</p>
                              <p className="text-green-400 font-medium">
                                {signal.tp2}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Stop Loss</p>
                              <p className="text-red-400 font-medium">
                                {signal.stopLoss}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Pips</p>
                              <p className="text-yellow-400 font-medium">
                                {signal.pips}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <p className="text-gray-400 text-sm">
                            {formatTimeAgo(signal.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Trading Education
              </h2>
              {selectedCourse ? (
                <div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg mb-6"
                  >
                    Back to Courses
                  </button>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {selectedCourse.description}
                  </p>

                  <div className="space-y-4">
                    {selectedCourse.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-4"
                      >
                        <h4 className="text-lg font-medium text-white mb-2">
                          {lesson.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {lesson.description}
                        </p>
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium capitalize">
                          {lesson.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {tradingCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Courses Available
                      </h3>
                      <p className="text-gray-300">
                        Check back later for new trading courses.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tradingCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6 hover:scale-105 transition-all"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <BookOpen className="h-8 w-8 text-blue-400" />
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                course.level === 'Beginner'
                                  ? 'bg-green-500/20 text-green-400'
                                  : course.level === 'Intermediate'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {course.level}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4">
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>{course.duration}</span>
                            <span>{course.lessons.length} lessons</span>
                          </div>
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
                          >
                            Start Course
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'news' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Market News & Updates
              </h2>
              {marketNews.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No News Available
                  </h3>
                  <p className="text-gray-300">
                    Check back later for market news.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketNews.map((news) => (
                    <div
                      key={news._id}
                      className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {news.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                news.impact === 'High'
                                  ? 'bg-red-500/20 text-red-400'
                                  : news.impact === 'Medium'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {news.impact}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-2">{news.summary}</p>
                          <p className="text-gray-400 text-sm">
                            {formatTimeAgo(news.createdAt)}
                          </p>
                        </div>
                        <Bell className="h-5 w-5 text-blue-400 flex-shrink-0 ml-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Market Analysis
              </h2>
              {marketAnalysis.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Analysis Available
                  </h3>
                  <p className="text-gray-300">
                    Check back later for market analysis.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {marketAnalysis.map((analysis) => (
                    <div
                      key={analysis._id}
                      className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {analysis.title}
                      </h3>
                      <div className="prose prose-invert text-gray-300">
                        <p>{analysis.content}</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-4">
                        {formatTimeAgo(analysis.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
