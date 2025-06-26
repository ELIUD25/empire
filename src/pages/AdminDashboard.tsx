import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  AlertCircle,
  Eye,
  Clock,
  Target,
  BarChart3,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface AdminStats {
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
}

interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  totalEarnings: number;
  referrals: number;
  isActivated: boolean;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
}

interface BettingTip {
  _id: string;
  match: string;
  league: string;
  prediction: string;
  odds: string;
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
  isActive: boolean;
  createdAt: string;
  time: string;
  date: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: 'pending' | 'published' | 'rejected';
  createdAt: string;
}

interface Advertisement {
  _id: string;
  title: string;
  brand: string;
  reward: number;
  category: string;
  type: string;
  isActive: boolean;
  currentViews: number;
  maxViews: number;
  createdAt: string;
  content?: string;
  status?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: string;
  type: string;
  isActive: boolean;
  currentResponses: number;
  maxResponses: number;
  createdAt: string;
  category?: string;
  status?: string;
}

interface DepositRequest {
  _id: string;
  userName: string;
  amount: number;
  status: string;
  mpesaMessage: string;
  createdAt: string;
}

interface WithdrawalRequest {
  _id: string;
  userName: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface TaskSubmission {
  _id: string;
  taskId: {
    title: string;
    reward: number;
  };
  userId: {
    name: string;
    email: string;
  };
  response: string;
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRevenue: 0,
    pendingActivations: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    pendingTasks: 0,
    pendingBlogs: 0,
    activeAds: 0,
    activeTasks: 0,
    activeSignals: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [bettingTips, setBettingTips] = useState<BettingTip[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>([]);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<
    'betting' | 'blog' | 'ad' | 'task' | null
  >(null);
  const [editingItem, setEditingItem] = useState<
    BettingTip | BlogPost | Advertisement | Task | null
  >(null);
  const [formData, setFormData] = useState<
    Partial<BettingTip | BlogPost | Advertisement | Task>
  >({});

  const dashboardStats = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-400/30',
      iconColor: 'text-blue-200',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-400/30',
      iconColor: 'text-green-200',
    },
    {
      label: 'Pending Activations',
      value: stats.pendingActivations,
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-400/30',
      iconColor: 'text-yellow-200',
    },
    {
      label: 'Active Signals',
      value: stats.activeSignals,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-400/30',
      iconColor: 'text-purple-200',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'deposits', label: 'Deposits', icon: DollarSign },
    { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign },
    { id: 'betting', label: 'Betting Tips', icon: Target },
    { id: 'blog', label: 'Blog Posts', icon: MessageSquare },
    { id: 'ads', label: 'Ads', icon: Eye },
    { id: 'tasks', label: 'Tasks', icon: Clock },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActivated && !user.isBanned) ||
      (filterStatus === 'pending' && !user.isActivated) ||
      (filterStatus === 'banned' && user.isBanned);
    return matchesSearch && matchesStatus;
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, depositsData, withdrawalsData] =
        await Promise.all([
          apiService.getAdminStats(),
          apiService.getAllUsers() as Promise<User[]>,
          apiService.getAdminDeposits(),
          apiService.getAdminWithdrawals(),
        ]);

      setStats(statsData);
      setUsers(usersData);
      setDeposits(depositsData);
      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async (type: string) => {
    try {
      setLoading(true);
      switch (type) {
        case 'betting': {
          const tips = (await apiService.getBettingTips()) as Promise<
            BettingTip[]
          >;
          setBettingTips(tips);
          break;
        }
        case 'blog': {
          const posts = (await apiService.getAdminBlogPosts()) as Promise<
            BlogPost[]
          >;
          setBlogPosts(posts);
          break;
        }
        case 'ads': {
          const ads = (await apiService.getAdminAdvertisements()) as Promise<
            Advertisement[]
          >;
          setAdvertisements(ads);
          break;
        }
        case 'tasks': {
          const [tasksData, submissionsData] = await Promise.all([
            apiService.getAdminTasks() as Promise<Task[]>,
            apiService.getAdminTaskSubmissions() as Promise<TaskSubmission[]>,
          ]);
          setTasks(tasksData);
          setTaskSubmissions(submissionsData);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (['betting', 'blog', 'ads', 'tasks'].includes(activeTab)) {
      fetchContentData(activeTab);
    }
  }, [activeTab]);

  const handleUserAction = async (
    userId: string,
    action: 'activate' | 'ban' | 'unban',
    banReason?: string
  ) => {
    try {
      if (action === 'activate') {
        await apiService.activateUser(userId);
        alert('User activated successfully');
      } else if (action === 'ban') {
        await apiService.banUser(userId, banReason || '');
        alert('User banned successfully');
      } else if (action === 'unban') {
        await apiService.unbanUser(userId);
        alert('User unbanned successfully');
      }
      fetchAdminData();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleContentAction = async (
    id: string,
    type: 'betting' | 'blog' | 'ad' | 'task',
    action: 'delete' | 'toggle'
  ) => {
    try {
      if (action === 'delete') {
        if (type === 'betting') {
          await apiService.deleteBettingTip(id);
        } else if (type === 'blog') {
          await apiService.deleteBlogPost(id);
        } else if (type === 'ad') {
          await apiService.deleteAdvertisement(id);
        } else if (type === 'task') {
          await apiService.deleteTask(id);
        }
        alert(`${type} deleted successfully`);
      } else if (action === 'toggle') {
        if (type === 'betting') {
          await apiService.toggleBettingTip(id);
        } else if (type === 'ad') {
          await apiService.toggleAdvertisement(id);
        } else if (type === 'task') {
          await apiService.toggleTask(id);
        }
        alert(`${type} status toggled successfully`);
      }
      fetchContentData(type);
    } catch (error) {
      console.error(`Failed to ${action} ${type}:`, error);
      alert(`Failed to ${action} ${type}`);
    }
  };

  const openEditModal = (
    type: 'betting' | 'blog' | 'ad' | 'task',
    item: BettingTip | BlogPost | Advertisement | Task
  ) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setShowCreateModal(true);
  };

  const handleSubmitForm = async () => {
    try {
      if (!modalType) return;

      if (editingItem) {
        switch (modalType) {
          case 'betting':
            await apiService.updateBettingTip(
              editingItem._id,
              formData as BettingTip
            );
            alert('Betting tip updated successfully');
            break;
          case 'blog':
            await apiService.updateBlogPost(
              editingItem._id,
              formData as BlogPost
            );
            alert('Blog post updated successfully');
            break;
          case 'ad':
            await apiService.updateAdvertisement(
              editingItem._id,
              formData as Advertisement
            );
            alert('Advertisement updated successfully');
            break;
          case 'task':
            await apiService.updateTask(editingItem._id, formData as Task);
            alert('Task updated successfully');
            break;
          default:
            throw new Error(`Unsupported modal type: ${modalType}`);
        }
      } else {
        switch (modalType) {
          case 'betting':
            await apiService.createBettingTip(formData as BettingTip);
            alert('Betting tip created successfully');
            break;
          case 'blog':
            await apiService.createBlogPost(formData as BlogPost);
            alert('Blog post created successfully');
            break;
          case 'ad':
            await apiService.createAdvertisement(formData as Advertisement);
            alert('Advertisement created successfully');
            break;
          case 'task':
            await apiService.createTask(formData as Task);
            alert('Task created successfully');
            break;
          default:
            throw new Error(`Unsupported modal type: ${modalType}`);
        }
      }
      setShowCreateModal(false);
      setEditingItem(null);
      setFormData({});
      fetchContentData(modalType);
    } catch (error) {
      console.error(
        `Failed to ${editingItem ? 'update' : 'create'} ${modalType}:`,
        error
      );
      alert(`Failed to ${editingItem ? 'update' : 'create'} ${modalType}`);
    }
  };

  const handleRequestAction = async (
    id: string,
    type: 'deposit' | 'withdrawal' | 'submission',
    action: 'approve' | 'reject',
    reason?: string
  ) => {
    try {
      if (type === 'deposit') {
        if (action === 'approve') {
          await apiService.approveDeposit(id);
        } else {
          await apiService.rejectDeposit(id, reason || '');
        }
      } else if (type === 'withdrawal') {
        if (action === 'approve') {
          await apiService.approveWithdrawal(id);
        } else {
          await apiService.rejectWithdrawal(id, reason || '');
        }
      } else if (type === 'submission') {
        if (action === 'approve') {
          await apiService.approveTaskSubmission(id);
        } else {
          await apiService.rejectTaskSubmission(id, reason || '');
        }
      }
      alert(`${type} ${action}d successfully`);
      fetchAdminData();
      if (type === 'submission') {
        fetchContentData('tasks');
      }
    } catch (error) {
      console.error(`Failed to ${action} ${type}:`, error);
      alert(`Failed to ${action} ${type}`);
    }
  };

  const renderModalContent = () => {
    if (!modalType) return null;

    switch (modalType) {
      case 'betting':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Match</label>
              <input
                type="text"
                value={formData.match || ''}
                onChange={(e) =>
                  setFormData({ ...formData, match: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">League</label>
              <input
                type="text"
                value={formData.league || ''}
                onChange={(e) =>
                  setFormData({ ...formData, league: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Prediction
              </label>
              <input
                type="text"
                value={formData.prediction || ''}
                onChange={(e) =>
                  setFormData({ ...formData, prediction: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Odds</label>
              <input
                type="text"
                value={formData.odds || ''}
                onChange={(e) =>
                  setFormData({ ...formData, odds: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Confidence
              </label>
              <select
                value={formData.confidence || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confidence: e.target.value as 'High' | 'Medium' | 'Low',
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              >
                <option value="" className="bg-gray-800">
                  Select confidence
                </option>
                <option value="High" className="bg-gray-800">
                  High
                </option>
                <option value="Medium" className="bg-gray-800">
                  Medium
                </option>
                <option value="Low" className="bg-gray-800">
                  Low
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Analysis
              </label>
              <textarea
                value={formData.analysis || ''}
                onChange={(e) =>
                  setFormData({ ...formData, analysis: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Time</label>
              <input
                type="text"
                value={formData.time || ''}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                placeholder="15:30"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.content || ''}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                rows={6}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Author</label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Status</label>
              <select
                value={formData.status || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | 'pending'
                      | 'published'
                      | 'rejected',
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              >
                <option value="pending" className="bg-gray-800">
                  Pending
                </option>
                <option value="published" className="bg-gray-800">
                  Published
                </option>
                <option value="rejected" className="bg-gray-800">
                  Rejected
                </option>
              </select>
            </div>
          </div>
        );
      case 'ad':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Brand</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Reward</label>
              <input
                type="number"
                value={formData.reward || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reward: parseFloat(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Type</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Max Views
              </label>
              <input
                type="number"
                value={formData.maxViews || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxViews: parseInt(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        );
      case 'task':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Reward</label>
              <input
                type="number"
                value={formData.reward || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reward: parseFloat(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Difficulty
              </label>
              <input
                type="text"
                value={formData.difficulty || ''}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Type</label>
              <input
                type="text"
                value={formData.type || ''}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Max Responses
              </label>
              <input
                type="number"
                value={formData.maxResponses || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxResponses: parseInt(e.target.value),
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={() => apiService.logout()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (['betting', 'blog', 'ads', 'tasks'].includes(tab.id)) {
                    fetchContentData(tab.id);
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
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

        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white mb-4 sm:mb-0"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-40 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Balance</th>
                    <th className="px-6 py-3 text-left">Earnings</th>
                    <th className="px-6 py-3 text-left">Referrals</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">${user.balance}</td>
                      <td className="px-6 py-4">${user.totalEarnings}</td>
                      <td className="px-6 py-4">{user.referrals}</td>
                      <td className="px-6 py-4">
                        {user.isBanned ? (
                          <span className="text-red-400">Banned</span>
                        ) : user.isActivated ? (
                          <span className="text-green-400">Active</span>
                        ) : (
                          <span className="text-yellow-400">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        {!user.isActivated && (
                          <button
                            onClick={() =>
                              handleUserAction(user._id, 'activate')
                            }
                            className="text-green-400 hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        {user.isBanned ? (
                          <button
                            onClick={() => handleUserAction(user._id, 'unban')}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <UserIcon className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUserAction(
                                user._id,
                                'ban',
                                prompt('Enter ban reason') || ''
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <NoSymbolIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">MPESA Message</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr
                    key={deposit._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4">{deposit.userName}</td>
                    <td className="px-6 py-4">${deposit.amount}</td>
                    <td className="px-6 py-4">{deposit.status}</td>
                    <td className="px-6 py-4">{deposit.mpesaMessage}</td>
                    <td className="px-6 py-4">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {deposit.status === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                deposit._id,
                                'deposit',
                                'approve'
                              )
                            }
                            className="text-green-400 hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                deposit._id,
                                'deposit',
                                'reject',
                                prompt('Enter rejection reason') || ''
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/10">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Method</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4">{withdrawal.userName}</td>
                    <td className="px-6 py-4">${withdrawal.amount}</td>
                    <td className="px-6 py-4">{withdrawal.method}</td>
                    <td className="px-6 py-4">{withdrawal.status}</td>
                    <td className="px-6 py-4">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                withdrawal._id,
                                'withdrawal',
                                'approve'
                              )
                            }
                            className="text-green-400 hover:text-green-300"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                withdrawal._id,
                                'withdrawal',
                                'reject',
                                prompt('Enter rejection reason') || ''
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'betting' && (
          <div>
            <button
              onClick={() => {
                setModalType('betting');
                setFormData({});
                setEditingItem(null);
                setShowCreateModal(true);
              }}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Betting Tip</span>
            </button>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Match</th>
                    <th className="px-6 py-3 text-left">League</th>
                    <th className="px-6 py-3 text-left">Prediction</th>
                    <th className="px-6 py-3 text-left">Odds</th>
                    <th className="px-6 py-3 text-left">Confidence</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bettingTips.map((tip) => (
                    <tr
                      key={tip._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{tip.match}</td>
                      <td className="px-6 py-4">{tip.league}</td>
                      <td className="px-6 py-4">{tip.prediction}</td>
                      <td className="px-6 py-4">{tip.odds}</td>
                      <td className="px-6 py-4">{tip.confidence}</td>
                      <td className="px-6 py-4">
                        {tip.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => openEditModal('betting', tip)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(tip._id, 'betting', 'delete')
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(tip._id, 'betting', 'toggle')
                          }
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <TrendingUpIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div>
            <button
              onClick={() => {
                setModalType('blog');
                setFormData({});
                setEditingItem(null);
                setShowCreateModal(true);
              }}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Blog Post</span>
            </button>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Author</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{post.title}</td>
                      <td className="px-6 py-4">{post.category}</td>
                      <td className="px-6 py-4">{post.author}</td>
                      <td className="px-6 py-4">{post.status}</td>
                      <td className="px-6 py-4">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => openEditModal('blog', post)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(post._id, 'blog', 'delete')
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div>
            <button
              onClick={() => {
                setModalType('ad');
                setFormData({});
                setEditingItem(null);
                setShowCreateModal(true);
              }}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Advertisement</span>
            </button>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Brand</th>
                    <th className="px-6 py-3 text-left">Reward</th>
                    <th className="px-6 py-3 text-left">Views</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {advertisements.map((ad) => (
                    <tr
                      key={ad._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{ad.title}</td>
                      <td className="px-6 py-4">{ad.brand}</td>
                      <td className="px-6 py-4">${ad.reward}</td>
                      <td className="px-6 py-4">
                        {ad.currentViews}/{ad.maxViews}
                      </td>
                      <td className="px-6 py-4">
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => openEditModal('ad', ad)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(ad._id, 'ad', 'delete')
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(ad._id, 'ad', 'toggle')
                          }
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <TrendingUpIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <button
              onClick={() => {
                setModalType('task');
                setFormData({});
                setEditingItem(null);
                setShowCreateModal(true);
              }}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Reward</th>
                    <th className="px-6 py-3 text-left">Responses</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{task.title}</td>
                      <td className="px-6 py-4">${task.reward}</td>
                      <td className="px-6 py-4">
                        {task.currentResponses}/{task.maxResponses}
                      </td>
                      <td className="px-6 py-4">
                        {task.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => openEditModal('task', task)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(task._id, 'task', 'delete')
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleContentAction(task._id, 'task', 'toggle')
                          }
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <TrendingUpIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="px-6 py-3 text-left">Task</th>
                    <th className="px-6 py-3 text-left">User</th>
                    <th className="px-6 py-3 text-left">Response</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taskSubmissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">{submission.taskId.title}</td>
                      <td className="px-6 py-4">{submission.userId.name}</td>
                      <td className="px-6 py-4">{submission.response}</td>
                      <td className="px-6 py-4">{submission.status}</td>
                      <td className="px-6 py-4">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleRequestAction(
                                  submission._id,
                                  'submission',
                                  'approve'
                                )
                              }
                              className="text-green-400 hover:text-green-300"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleRequestAction(
                                  submission._id,
                                  'submission',
                                  'reject',
                                  prompt('Enter rejection reason') || ''
                                )
                              }
                              className="text-red-400 hover:text-red-300"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingItem ? `Edit ${modalType}` : `Create ${modalType}`}
              </h2>
              {renderModalContent()}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
