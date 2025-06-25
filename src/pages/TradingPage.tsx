import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, BookOpen, Bell, BarChart3, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface TradingCourse {
  _id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isActive: boolean;
  createdAt: string;
}

interface CourseLesson {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  lessonType: 'video' | 'text' | 'exam';
  lessonOrder: number;
  videoUrl?: string;
  content?: string;
  examQuestions?: ExamQuestion[];
}

interface UserCourseProgress {
  _id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const TradingPage: React.FC = () => {
  const [user, setUser] = useState<{ id: string; name?: string; isActivated?: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState('signals');
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([]);
  const [tradingCourses, setTradingCourses] = useState<TradingCourse[]>([]);
  const [selectedCourse, setCourse] = useState<TradingCourse | null>(null);
  const [courseLessons, setLessons] = useState<CourseLesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [userProgress, setUserProgress] = useState<UserCourseProgress[]>([]);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [showExamResults, setShowExamResults] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUser(data.user);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const generateCertificate = async (name: string, courseTitle: string, date: string, level: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 400, 100);
    ctx.font = '24px Arial';
    ctx.fillText(name, 400, 200);
    ctx.fillText(`Course: ${courseTitle}`, 400, 250);
    ctx.fillText(`Level: ${level}`, 400, 300);
    ctx.fillText(`Date: ${date}`, 400, 350);

    const base64 = canvas.toDataURL('image/png');
    const publicId = `certificate_${courseTitle}_${Date.now()}`;
    const res = await fetch('/api/upload-certificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ base64, publicId }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.url;
  };

  const fetchCourseData = useCallback(async () => {
    if (!selectedCourse || !user) return;

    try {
      const lessonsRes = await fetch(`/api/course-lessons/${selectedCourse._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const lessons = await lessonsRes.json();
      if (lessons.error) throw new Error(lessons.error);

      const progressRes = await fetch(`/api/user-course-progress/${selectedCourse._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const progress = await progressRes.json();
      if (progress.error) throw new Error(progress.error);

      setLessons(lessons);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }, [selectedCourse, user]);

  const fetchTradingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [signalsRes, newsRes, analysisRes, coursesRes] = await Promise.all([
        fetch('/api/trading-signals', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/market-news', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/market-analysis', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/trading-courses', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const signals = await signalsRes.json();
      const news = await newsRes.json();
      const analysis = await analysisRes.json();
      const courses = await coursesRes.json();

      if (signals.error || news.error || analysis.error || courses.error) {
        throw new Error('Failed to fetch trading data');
      }

      setTradingSignals(signals);
      setMarketNews(news);
      setMarketAnalysis(analysis);
      setTradingCourses(courses);
    } catch (error) {
      console.error('Error fetching trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradingData();
  }, []);

  useEffect(() => {
    if (selectedCourse && user) {
      fetchCourseData();
    }
  }, [selectedCourse, user, fetchCourseData]);

  const handleStartCourse = (course: TradingCourse) => {
    setCourse(course);
    setCurrentLesson(0);
    setExamAnswers({});
    setShowExamResults(false);
  };

  const handleCompleteLesson = async () => {
    if (!selectedCourse || !user || !courseLessons[currentLesson]) return;

    const lesson = courseLessons[currentLesson];

    try {
      const res = await fetch('/api/user-course-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          lessonId: lesson._id,
          completed: true,
          completedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await fetchCourseData();

      const completedLessons = userProgress.filter((p: UserCourseProgress) => p.completed).length + 1;
      if (completedLessons === courseLessons.length) {
        await generateCourseCertificate();
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const handleExamSubmit = async () => {
    if (!selectedCourse || !user || !courseLessons[currentLesson]) return;

    const lesson = courseLessons[currentLesson];
    if (lesson.lessonType !== 'exam' || !lesson.examQuestions) return;

    let correct = 0;
    lesson.examQuestions.forEach((question: ExamQuestion, index: number) => {
      if (examAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / lesson.examQuestions.length) * 100);
    setExamScore(score);
    setShowExamResults(true);

    if (score >= 70) {
      try {
        const res = await fetch('/api/user-course-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            courseId: selectedCourse._id,
            lessonId: lesson._id,
            completed: true,
            score,
            completedAt: new Date().toISOString(),
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        await fetchCourseData();
      } catch (error) {
        console.error('Error saving exam results:', error);
      }
    }
  };

  const generateCourseCertificate = async () => {
    if (!selectedCourse || !user) return;

    try {
      const certificateUrl = await generateCertificate(
        user.name || 'User',
        selectedCourse.title,
        new Date().toLocaleDateString(),
        selectedCourse.level
      );

      const res = await fetch('/api/course-certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          courseId: selectedCourse._id,
          certificateUrl,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      alert('Congratulations! You have completed the course. Your certificate is ready for download.');
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some((p: UserCourseProgress) => p.lessonId === lessonId && p.completed);
  };

  const canAccessLesson = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const previousLesson = courseLessons[lessonIndex - 1];
    return isLessonCompleted(previousLesson._id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const winRate =
    tradingSignals.length > 0
      ? Math.round(
          (tradingSignals.filter((s) => s.status === 'hit_tp1' || s.status === 'hit_tp2').length / tradingSignals.length) *
            100
        )
      : 0;

  const totalPips = tradingSignals.reduce((sum, signal) => sum + signal.pips, 0);

  const stats = [
    { label: 'Win Rate', value: `${winRate}%`, color: 'text-green-400' },
    { label: 'Total Pips', value: `+${totalPips}`, color: 'text-blue-400' },
    { label: 'Signals Sent', value: tradingSignals.length.toString(), color: 'text-purple-400' },
    { label: 'Market Coverage', value: '24/7', color: 'text-yellow-400' },
  ];

  if (!user) return null;

  if (!user.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Trading Locked</h1>
            <p className="text-xl text-gray-300 mb-6">Activate your account to access trading signals and education.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-600 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
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
          <p className="text-xl text-gray-300">Professional forex signals and trading education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/20 backdrop-blur-md border border-gray-200/20 rounded-xl p-2 mb-8">
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
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/20'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/20 backdrop-blur-md border border-gray-200/20 rounded-xl p-6">
          {activeTab === 'signals' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Live Trading Signals</h2>
              {tradingSignals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Signals Available</h3>
                  <p className="text-gray-300">Check back later for new trading signals.</p>
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
                            <h3 className="text-xl font-semibold text-white">{signal.pair}</h3>
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
                                  : signal.status === 'hit_tp1' || signal.status === 'hit_tp2'
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
                              <p className="text-white font-medium">{signal.entryPrice}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP1</p>
                              <p className="text-green-400 font-medium">{signal.tp1}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">TP2</p>
                              <p className="text-green-400 font-medium">{signal.tp2}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Stop Loss</p>
                              <p className="text-red-400 font-medium">{signal.stopLoss}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Pips</p>
                              <p className="text-yellow-400 font-medium">{signal.pips}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <p className="text-gray-400 text-sm">{formatTimeAgo(signal.createdAt)}</p>
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
              <h2 className="text-2xl font-semibold text-white mb-6">Trading Education</h2>
              {selectedCourse ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setCourse(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Back to Courses
                    </button>
                    <div className="text-white">
                      Lesson {currentLesson + 1} of {courseLessons.length}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4">{selectedCourse.title}</h3>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          (userProgress.filter((p: UserCourseProgress) => p.completed).length / courseLessons.length) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (userProgress.filter((p: UserCourseProgress) => p.completed).length / courseLessons.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {courseLessons.map((lesson, index) => (
                      <button
                        key={lesson._id}
                        onClick={() => setCurrentLesson(index)}
                        disabled={!canAccessLesson(index)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          currentLesson === index
                            ? 'border-blue-400 bg-blue-600/20'
                            : canAccessLesson(index)
                            ? 'border-gray-200/20 bg-gray-800/20 hover:bg-gray-800/30'
                            : 'border-gray-600 bg-gray-600/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Lesson {index + 1}</span>
                          {isLessonCompleted(lesson._id) && <CheckCircle className="h-4 w-4 text-green-400" />}
                        </div>
                        <p className="text-white text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{lesson.lessonType}</p>
                      </button>
                    ))}
                  </div>

                  {courseLessons[currentLesson] && (
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6 mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <h4 className="text-lg font-medium text-white">{courseLessons[currentLesson].title}</h4>
                        {isLessonCompleted(courseLessons[currentLesson]._id) && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>

                      {courseLessons[currentLesson].lessonType === 'video' ? (
                        <div className="mb-4">
                          <video
                            src={courseLessons[currentLesson].videoUrl}
                            controls
                            className="w-full rounded-lg"
                            onEnded={handleCompleteLesson}
                          />
                        </div>
                      ) : courseLessons[currentLesson].lessonType === 'text' ? (
                        <div className="prose prose-invert text-gray-300 mb-4">
                          <p>{courseLessons[currentLesson].content}</p>
                        </div>
                      ) : courseLessons[currentLesson].lessonType === 'exam' ? (
                        <div className="mb-4">
                          <h5 className="text-lg font-medium text-white mb-4">Exam - Pass with 70% or higher</h5>
                          {courseLessons[currentLesson].examQuestions?.map((question: ExamQuestion, qIndex: number) => (
                            <div key={qIndex} className="mb-6 p-4 bg-gray-800/20 rounded-lg">
                              <p className="text-white mb-3">{question.question}</p>
                              <div className="space-y-2">
                                {question.options.map((option: string, oIndex: number) => (
                                  <label key={oIndex} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`question-${qIndex}`}
                                      value={oIndex}
                                      onChange={() => setExamAnswers((prev) => ({ ...prev, [qIndex]: oIndex }))}
                                      className="text-blue-600"
                                      disabled={showExamResults}
                                    />
                                    <span className="text-gray-300">{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}

                          {!showExamResults ? (
                            <button
                              onClick={handleExamSubmit}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                              Submit Exam
                            </button>
                          ) : (
                            <div
                              className={`p-4 rounded-lg ${
                                examScore >= 70 ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'
                              }`}
                            >
                              <p className={`font-medium ${examScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                                Score: {examScore}% - {examScore >= 70 ? 'Passed!' : 'Failed. Please retake the exam.'}
                              </p>
                              {examScore < 70 && (
                                <button
                                  onClick={() => {
                                    setShowExamResults(false);
                                    setExamAnswers({});
                                  }}
                                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                  Retake Exam
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <div className="flex justify-between">
                        {courseLessons[currentLesson].lessonType !== 'exam' && (
                          <button
                            onClick={handleCompleteLesson}
                            disabled={isLessonCompleted(courseLessons[currentLesson]._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLessonCompleted(courseLessons[currentLesson]._id) ? 'Completed' : 'Mark Complete'}
                          </button>
                        )}

                        <button
                          onClick={() => setCurrentLesson((prev) => prev + 1)}
                          disabled={currentLesson >= courseLessons.length - 1 || !isLessonCompleted(courseLessons[currentLesson]._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {tradingCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Courses Available</h3>
                      <p className="text-gray-300">Check back later for new trading courses.</p>
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
                                  ? 'bg-green-500/20 text-blue-400'
                                  : course.level === 'Intermediate'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {course.level}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                            <span>{course.duration}</span>
                          </div>
                          <button
                            onClick={() => handleStartCourse(course)}
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
              <h2 className="text-2xl font-semibold text-white mb-6">Market News & Updates</h2>
              {marketNews.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No News Available</h3>
                  <p className="text-gray-300">Check back later for market news.</p>
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
                            <h3 className="text-lg font-semibold text-white">{news.title}</h3>
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
                          <p className="text-gray-400 text-sm">{formatTimeAgo(news.createdAt)}</p>
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
              <h2 className="text-2xl font-semibold text-white mb-6">Market Analysis</h2>
              {marketAnalysis.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No analysis available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {marketAnalysis.map((analysis) => (
                    <div
                      key={analysis._id}
                      className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">{analysis.title}</h3>
                      <div className="prose prose-invert text-gray-300">
                        <p>{analysis.content}</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-4">{formatTimeAgo(analysis.createdAt)}</p>
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
