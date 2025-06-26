import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface BettingTip {
  id: number;
  match: string;
  league: string;
  time: string;
  prediction: string;
  odds: string;
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
  date: string;
}

interface BettingResult {
  match: string;
  prediction: string;
  result: 'Won' | 'Lost';
  odds: string;
  profit: string;
}

interface TradingSignal {
  id: number;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  status: string;
  time: string;
  pips: string;
}

interface MarketNews {
  id: number;
  title: string;
  summary: string;
  impact: string;
  time: string;
}

interface MarketAnalysis {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface TradingCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  lessons: Array<{
    id: number;
    type: 'video' | 'text' | 'exam';
    title: string;
    content: string;
    completed?: boolean;
    examQuestions?: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  }>;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  authorId: string;
  status: 'pending' | 'published' | 'rejected';
  views: number;
  createdAt: string;
  feedback?: string;
}

interface Advertisement {
  id: number;
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
  isActive: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'survey' | 'task' | 'bidding' | 'transcription';
  reward: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requirements: string;
  maxResponses?: number;
  currentResponses?: number;
  maxBidders?: number;
  currentBidders?: number;
  deadline?: string;
  canRedo?: boolean;
  questions?: Array<{
    type: 'multiple' | 'text';
    question: string;
    options?: string[];
  }>;
  instructions?: string;
  attachments?: string[];
  audioUrl?: string;
  isActive: boolean;
}

interface TaskSubmission {
  id: number;
  taskId: number;
  userId: string;
  response: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  feedback?: string;
}

interface DepositRequest {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  mpesaMessage: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface WithdrawalRequest {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  method: 'mpesa' | 'bank';
  details: unknown;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface UserActivity {
  id: number;
  userId: string;
  type: string;
  description: string;
  amount?: number;
  timestamp: string;
}

interface DataContextType {
  bettingTips: BettingTip[];
  bettingResults: BettingResult[];
  addBettingTip: (tip: Omit<BettingTip, 'id'>) => void;
  updateBettingTip: (id: number, tip: Partial<BettingTip>) => void;
  deleteBettingTip: (id: number) => void;
  addBettingResult: (result: BettingResult) => void;
  deleteBettingResult: (index: number) => void;
  tradingSignals: TradingSignal[];
  marketNews: MarketNews[];
  marketAnalysis: MarketAnalysis[];
  tradingCourses: TradingCourse[];
  addTradingSignal: (signal: Omit<TradingSignal, 'id'>) => void;
  updateTradingSignal: (id: number, signal: Partial<TradingSignal>) => void;
  deleteTradingSignal: (id: number) => void;
  addMarketNews: (news: Omit<MarketNews, 'id'>) => void;
  updateMarketNews: (id: number, news: Partial<MarketNews>) => void;
  deleteMarketNews: (id: number) => void;
  addMarketAnalysis: (analysis: Omit<MarketAnalysis, 'id'>) => void;
  updateMarketAnalysis: (id: number, analysis: Partial<MarketAnalysis>) => void;
  deleteMarketAnalysis: (id: number) => void;
  addTradingCourse: (course: Omit<TradingCourse, 'id'>) => void;
  updateTradingCourse: (id: number, course: Partial<TradingCourse>) => void;
  deleteTradingCourse: (id: number) => void;
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'views' | 'createdAt'>) => void;
  updateBlogPost: (id: number, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: number) => void;
  approveBlogPost: (id: number) => void;
  rejectBlogPost: (id: number, feedback: string) => void;
  advertisements: Advertisement[];
  addAdvertisement: (ad: Omit<Advertisement, 'id' | 'currentViews'>) => void;
  updateAdvertisement: (id: number, ad: Partial<Advertisement>) => void;
  deleteAdvertisement: (id: number) => void;
  incrementAdView: (id: number) => void;
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  addTask: (
    task: Omit<Task, 'id' | 'currentResponses' | 'currentBidders'>
  ) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  submitTask: (submission: Omit<TaskSubmission, 'id' | 'submittedAt'>) => void;
  approveTaskSubmission: (id: number) => void;
  rejectTaskSubmission: (id: number, feedback: string) => void;
  depositRequests: DepositRequest[];
  withdrawalRequests: WithdrawalRequest[];
  addDepositRequest: (
    request: Omit<DepositRequest, 'id' | 'submittedAt'>
  ) => void;
  addWithdrawalRequest: (
    request: Omit<WithdrawalRequest, 'id' | 'submittedAt'>
  ) => void;
  approveDeposit: (id: number) => void;
  rejectDeposit: (id: number) => void;
  approveWithdrawal: (id: number) => void;
  rejectWithdrawal: (id: number) => void;
  userActivities: UserActivity[];
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  getStats: () => {
    totalUsers: number;
    totalRevenue: number;
    pendingActivations: number;
    pendingDeposits: number;
    pendingWithdrawals: number;
    pendingTasks: number;
    pendingBlogs: number;
    activeAds: number;
    activeTasks: number;
    activeSignals: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [bettingTips, setBettingTips] = useState<BettingTip[]>([]);
  const [bettingResults, setBettingResults] = useState<BettingResult[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([]);
  const [tradingCourses, setTradingCourses] = useState<TradingCourse[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('empiremine_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        setBettingTips(data.bettingTips || []);
        setBettingResults(data.bettingResults || []);
        setTradingSignals(data.tradingSignals || []);
        setMarketNews(data.marketNews || []);
        setMarketAnalysis(data.marketAnalysis || []);
        setTradingCourses(data.tradingCourses || []);
        setBlogPosts(data.blogPosts || []);
        setAdvertisements(data.advertisements || []);
        setTasks(data.tasks || []);
        setTaskSubmissions(data.taskSubmissions || []);
        setDepositRequests(data.depositRequests || []);
        setWithdrawalRequests(data.withdrawalRequests || []);
        setUserActivities(data.userActivities || []);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = () => {
      const data = {
        bettingTips,
        bettingResults,
        tradingSignals,
        marketNews,
        marketAnalysis,
        tradingCourses,
        blogPosts,
        advertisements,
        tasks,
        taskSubmissions,
        depositRequests,
        withdrawalRequests,
        userActivities,
      };
      localStorage.setItem('empiremine_data', JSON.stringify(data));
    };
    saveData();
  }, [
    bettingTips,
    bettingResults,
    tradingSignals,
    marketNews,
    marketAnalysis,
    tradingCourses,
    blogPosts,
    advertisements,
    tasks,
    taskSubmissions,
    depositRequests,
    withdrawalRequests,
    userActivities,
  ]);

  const addBettingTip = (tip: Omit<BettingTip, 'id'>) => {
    const newTip = { ...tip, id: Date.now() };
    setBettingTips((prev) => [newTip, ...prev]);
  };

  const updateBettingTip = (id: number, tip: Partial<BettingTip>) => {
    setBettingTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...tip } : t))
    );
  };

  const deleteBettingTip = (id: number) => {
    setBettingTips((prev) => prev.filter((t) => t.id !== id));
  };

  const addBettingResult = (result: BettingResult) => {
    setBettingResults((prev) => [result, ...prev]);
  };

  const deleteBettingResult = (index: number) => {
    setBettingResults((prev) => prev.filter((_, i) => i !== index));
  };

  const addTradingSignal = (signal: Omit<TradingSignal, 'id'>) => {
    const newSignal = { ...signal, id: Date.now() };
    setTradingSignals((prev) => [newSignal, ...prev]);
  };

  const updateTradingSignal = (id: number, signal: Partial<TradingSignal>) => {
    setTradingSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...signal } : s))
    );
  };

  const deleteTradingSignal = (id: number) => {
    setTradingSignals((prev) => prev.filter((s) => s.id !== id));
  };

  const addMarketNews = (news: Omit<MarketNews, 'id'>) => {
    const newNews = { ...news, id: Date.now() };
    setMarketNews((prev) => [newNews, ...prev]);
  };

  const updateMarketNews = (id: number, news: Partial<MarketNews>) => {
    setMarketNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...news } : n))
    );
  };

  const deleteMarketNews = (id: number) => {
    setMarketNews((prev) => prev.filter((n) => n.id !== id));
  };

  const addMarketAnalysis = (analysis: Omit<MarketAnalysis, 'id'>) => {
    const newAnalysis = { ...analysis, id: Date.now() };
    setMarketAnalysis((prev) => [newAnalysis, ...prev]);
  };

  const updateMarketAnalysis = (
    id: number,
    analysis: Partial<MarketAnalysis>
  ) => {
    setMarketAnalysis((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...analysis } : a))
    );
  };

  const deleteMarketAnalysis = (id: number) => {
    setMarketAnalysis((prev) => prev.filter((a) => a.id !== id));
  };

  const addTradingCourse = (course: Omit<TradingCourse, 'id'>) => {
    const newCourse = { ...course, id: Date.now() };
    setTradingCourses((prev) => [newCourse, ...prev]);
  };

  const updateTradingCourse = (id: number, course: Partial<TradingCourse>) => {
    setTradingCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...course } : c))
    );
  };

  const deleteTradingCourse = (id: number) => {
    setTradingCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'views' | 'createdAt'>) => {
    const newPost = {
      ...post,
      id: Date.now(),
      views: 0,
      createdAt: new Date().toISOString(),
    };
    setBlogPosts((prev) => [newPost, ...prev]);
  };

  const updateBlogPost = (id: number, post: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...post } : p))
    );
  };

  const deleteBlogPost = (id: number) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const approveBlogPost = (id: number) => {
    setBlogPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'published' as const } : p
      )
    );
  };

  const rejectBlogPost = (id: number, feedback: string) => {
    setBlogPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'rejected' as const, feedback } : p
      )
    );
  };

  const addAdvertisement = (ad: Omit<Advertisement, 'id' | 'currentViews'>) => {
    const newAd = { ...ad, id: Date.now(), currentViews: 0 };
    setAdvertisements((prev) => [newAd, ...prev]);
  };

  const updateAdvertisement = (id: number, ad: Partial<Advertisement>) => {
    setAdvertisements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...ad } : a))
    );
  };

  const deleteAdvertisement = (id: number) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
  };

  const incrementAdView = (id: number) => {
    setAdvertisements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, currentViews: a.currentViews + 1 } : a
      )
    );
  };

  const addTask = (
    task: Omit<Task, 'id' | 'currentResponses' | 'currentBidders'>
  ) => {
    const newTask = {
      ...task,
      id: Date.now(),
      currentResponses: 0,
      currentBidders: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: number, task: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...task } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const submitTask = (
    submission: Omit<TaskSubmission, 'id' | 'submittedAt'>
  ) => {
    const newSubmission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setTaskSubmissions((prev) => [newSubmission, ...prev]);

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === submission.taskId) {
          if (task.type === 'bidding' || task.type === 'transcription') {
            return { ...task, currentBidders: (task.currentBidders || 0) + 1 };
          } else {
            return {
              ...task,
              currentResponses: (task.currentResponses || 0) + 1,
            };
          }
        }
        return task;
      })
    );
  };

  const approveTaskSubmission = (id: number) => {
    setTaskSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const } : s))
    );
  };

  const rejectTaskSubmission = (id: number, feedback: string) => {
    setTaskSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'rejected' as const, feedback } : s
      )
    );
  };

  const addDepositRequest = (
    request: Omit<DepositRequest, 'id' | 'submittedAt'>
  ) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setDepositRequests((prev) => [newRequest, ...prev]);
  };

  const addWithdrawalRequest = (
    request: Omit<WithdrawalRequest, 'id' | 'submittedAt'>
  ) => {
    const newRequest = {
      ...request,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setWithdrawalRequests((prev) => [newRequest, ...prev]);
  };

  const approveDeposit = (id: number) => {
    setDepositRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
  };

  const rejectDeposit = (id: number) => {
    setDepositRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const approveWithdrawal = (id: number) => {
    setWithdrawalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
  };

  const rejectWithdrawal = (id: number) => {
    setWithdrawalRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const addUserActivity = (
    activity: Omit<UserActivity, 'id' | 'timestamp'>
  ) => {
    const newActivity = {
      ...activity,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setUserActivities((prev) => [newActivity, ...prev.slice(0, 99)]);
  };

  const getStats = () => {
    return {
      totalUsers: 1,
      totalRevenue: depositRequests
        .filter((r) => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0),
      pendingActivations: 0,
      pendingDeposits: depositRequests.filter((r) => r.status === 'pending')
        .length,
      pendingWithdrawals: withdrawalRequests.filter(
        (r) => r.status === 'pending'
      ).length,
      pendingTasks: taskSubmissions.filter((s) => s.status === 'pending')
        .length,
      pendingBlogs: blogPosts.filter((p) => p.status === 'pending').length,
      activeAds: advertisements.filter((a) => a.isActive).length,
      activeTasks: tasks.filter((t) => t.isActive).length,
      activeSignals: tradingSignals.length,
    };
  };

  const value = {
    bettingTips,
    bettingResults,
    addBettingTip,
    updateBettingTip,
    deleteBettingTip,
    addBettingResult,
    deleteBettingResult,
    tradingSignals,
    marketNews,
    marketAnalysis,
    tradingCourses,
    addTradingSignal,
    updateTradingSignal,
    deleteTradingSignal,
    addMarketNews,
    updateMarketNews,
    deleteMarketNews,
    addMarketAnalysis,
    updateMarketAnalysis,
    deleteMarketAnalysis,
    addTradingCourse,
    updateTradingCourse,
    deleteTradingCourse,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    approveBlogPost,
    rejectBlogPost,
    advertisements,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    incrementAdView,
    tasks,
    taskSubmissions,
    addTask,
    updateTask,
    deleteTask,
    submitTask,
    approveTaskSubmission,
    rejectTaskSubmission,
    depositRequests,
    withdrawalRequests,
    addDepositRequest,
    addWithdrawalRequest,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    userActivities,
    addUserActivity,
    getStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
