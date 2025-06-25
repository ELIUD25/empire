import React, { useState, useEffect } from 'react';
import { Crown, Users, DollarSign, AlertCircle, CheckCircle, Eye, Clock, Target, TrendingUp } from 'lucide-react';
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
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
    activeSignals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const data = await apiService.getAdminStats();
      setStats(data);
    } catch {
      console.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-400/30 rounded-xl p-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-xl text-gray-300">You don't have permission to access this page.</p>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-400/30',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Total Revenue',
      value: `${stats.totalRevenue} KES`,
      icon: DollarSign,
      color: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-400/30',
      iconColor: 'text-green-400'
    },
    {
      label: 'Pending Activations',
      value: stats.pendingActivations.toString(),
      icon: AlertCircle,
      color: 'from-orange-600/20 to-red-600/20',
      borderColor: 'border-orange-400/30',
      iconColor: 'text-orange-400'
    },
    {
      label: 'Active Ads',
      value: stats.activeAds.toString(),
      icon: Eye,
      color: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-400/30',
      iconColor: 'text-purple-400'
    }
  ];

  const pendingItems = [
    {
      label: 'Pending Deposits',
      value: stats.pendingDeposits,
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Pending Withdrawals',
      value: stats.pendingWithdrawals,
      icon: DollarSign,
      color: 'text-blue-400'
    },
    {
      label: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'text-purple-400'
    },
    {
      label: 'Pending Blogs',
      value: stats.pendingBlogs,
      icon: Target,
      color: 'text-yellow-400'
    }
  ];

  const systemStats = [
    {
      label: 'Active Tasks',
      value: stats.activeTasks,
      icon: Clock,
      color: 'text-cyan-400'
    },
    {
      label: 'Trading Signals',
      value: stats.activeSignals,
      icon: TrendingUp,
      color: 'text-indigo-400'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-300">
            Welcome back, {user.name}! Here's your platform overview.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Items */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Pending Reviews</h2>
            <div className="space-y-4">
              {pendingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-600/10 to-gray-700/10 border border-gray-400/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">System Overview</h2>
            <div className="space-y-4">
              {systemStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-600/10 to-gray-700/10 border border-gray-400/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <span className="text-white font-medium">{stat.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Review Pending Items</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Create Content</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-400/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">New user registration</p>
                  <p className="text-gray-400 text-sm">john.doe@example.com joined the platform</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">2 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-400/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Deposit request submitted</p>
                  <p className="text-gray-400 text-sm">500 KES deposit pending approval</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">5 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Task submission received</p>
                  <p className="text-gray-400 text-sm">Survey task completed by user</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">10 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;