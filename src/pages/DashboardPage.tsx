import React, { useState } from 'react';
import { Crown, DollarSign, Users, TrendingUp, Eye, Clock, Gift, Copy, CheckCircle, AlertCircle, CreditCard, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

const DashboardPage: React.FC = () => {
  const { user, activateAccount } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('mpesa');
  const [withdrawDetails, setWithdrawDetails] = useState({
    phoneNumber: '',
    accountNumber: '',
    bankName: ''
  });
  const [copied, setCopied] = useState(false);
  const [activating, setActivating] = useState(false);

  if (!user) return null;

  const copyReferralLink = async () => {
    await navigator.clipboard.writeText(user.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivation = async () => {
    if (user.balance < 500) {
      alert('Insufficient balance! Please deposit at least 500 KES to activate your account.');
      return;
    }

    setActivating(true);
    try {
      await activateAccount();
      alert('Account activated successfully! You can now access all earning features.');
    } catch {
      alert('Activation failed. Please try again.');
    } finally {
      setActivating(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !mpesaMessage) {
      alert('Please fill in all fields');
      return;
    }

    try {
      alert('Deposit request submitted! Please wait for admin approval.');
      setShowDepositModal(false);
      setDepositAmount('');
      setMpesaMessage('');
    } catch {
      alert('Failed to submit deposit request');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      alert('Please enter withdrawal amount');
      return;
    }

    if (parseInt(withdrawAmount) > user.balance) {
      alert('Insufficient balance');
      return;
    }

    if (withdrawMethod === 'mpesa' && !withdrawDetails.phoneNumber) {
      alert('Please enter M-Pesa phone number');
      return;
    }

    if (withdrawMethod === 'bank' && (!withdrawDetails.accountNumber || !withdrawDetails.bankName)) {
      alert('Please enter bank details');
      return;
    }

    try {
      alert('Withdrawal request submitted! Please wait for admin approval.');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawDetails({ phoneNumber: '', accountNumber: '', bankName: '' });
    } catch {
      alert('Failed to submit withdrawal request');
    }
  };

  const stats = [
    {
      label: 'Current Balance',
      value: `${user.balance} KES`,
      icon: DollarSign,
      color: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-400/30',
      iconColor: 'text-green-400'
    },
    {
      label: 'Total Earnings',
      value: `${user.totalEarnings} KES`,
      icon: TrendingUp,
      color: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-400/30',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Referrals',
      value: user.referrals.toString(),
      icon: Users,
      color: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-400/30',
      iconColor: 'text-purple-400'
    },
    {
      label: 'Account Status',
      value: user.isActivated ? 'Active' : 'Inactive',
      icon: user.isActivated ? CheckCircle : AlertCircle,
      color: user.isActivated ? 'from-green-600/20 to-emerald-600/20' : 'from-orange-600/20 to-red-600/20',
      borderColor: user.isActivated ? 'border-green-400/30' : 'border-orange-400/30',
      iconColor: user.isActivated ? 'text-green-400' : 'text-orange-400'
    }
  ];

  const earningMethods = [
    { name: 'Referral Program', icon: Users, earnings: '200-250 KES per referral', status: 'Available' },
    { name: 'Blog Writing', icon: Eye, earnings: 'Per post rewards', status: user.isActivated ? 'Available' : 'Locked' },
    { name: 'Watch Ads', icon: Eye, earnings: '10 KES per ad', status: user.isActivated ? 'Available' : 'Locked' },
    { name: 'Microtasks', icon: Clock, earnings: 'Variable rewards', status: user.isActivated ? 'Available' : 'Locked' },
    { name: 'Casino Games', icon: Gift, earnings: 'Game rewards', status: user.isActivated ? 'Available' : 'Locked' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
          </div>
          <p className="text-gray-300">
            {user.isActivated 
              ? 'Your account is active. Start earning now!' 
              : 'Activate your account to unlock all earning features.'}
          </p>
        </div>

        {/* Activation Banner */}
        {!user.isActivated && (
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Account Activation Required</h3>
                <p className="text-gray-300 mb-4">
                  Activate your account for 500 KES to unlock all earning features including ads, tasks, casino, and more!
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Referral earnings available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <span className="text-gray-300">Other features locked</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleActivation}
                disabled={activating || user.balance < 500}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activating ? 'Activating...' : 'Activate Now - 500 KES'}
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-4 rounded-lg transition-all flex items-center space-x-3"
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="font-medium">Deposit Funds</span>
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={user.balance === 0}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-4 rounded-lg transition-all flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Banknote className="h-6 w-6" />
                  <span className="font-medium">Withdraw Funds</span>
                </button>
              </div>
            </div>

            {/* Earning Methods */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Earning Methods</h2>
              <div className="space-y-4">
                {earningMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-600/10 to-gray-700/10 border border-gray-400/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <method.icon className="h-6 w-6 text-blue-400" />
                      <div>
                        <h3 className="text-white font-medium">{method.name}</h3>
                        <p className="text-gray-400 text-sm">{method.earnings}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        method.status === 'Available'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {method.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Referral Program</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Your Referral Code</p>
                  <p className="text-2xl font-bold text-yellow-400">{user.referralCode}</p>
                </div>
                
                <div>
                  <p className="text-gray-300 text-sm mb-2">Referral Link</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={user.referralLink}
                      readOnly
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Referral Rewards</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">1st Level:</span>
                      <span className="text-green-400">200 KES</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">2nd Level:</span>
                      <span className="text-blue-400">150 KES</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">3rd Level:</span>
                      <span className="text-purple-400">50 KES</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Member Since:</span>
                  <span className="text-white">{new Date(user.registeredAt).toLocaleDateString()}</span>
                </div>
                {user.activatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Activated:</span>
                    <span className="text-white">{new Date(user.activatedAt).toLocaleDateString()}</span>
                  </div>
                )}
                {user.referredBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Referred By:</span>
                    <span className="text-white">{user.referredBy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Deposit Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Amount (KES)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">M-Pesa Confirmation Message</label>
                  <textarea
                    value={mpesaMessage}
                    onChange={(e) => setMpesaMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                    placeholder="Paste your M-Pesa confirmation message here"
                  />
                </div>
                
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    Send money to: <strong>0712345678</strong><br />
                    Then paste the confirmation message above.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Withdraw Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Amount (KES)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter amount"
                    min="1"
                    max={user.balance}
                  />
                  <p className="text-xs text-gray-400 mt-1">Available: {user.balance} KES</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Withdrawal Method</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="mpesa" className="bg-gray-800">M-Pesa</option>
                    <option value="bank" className="bg-gray-800">Bank Transfer</option>
                  </select>
                </div>
                
                {withdrawMethod === 'mpesa' ? (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      value={withdrawDetails.phoneNumber}
                      onChange={(e) => setWithdrawDetails({...withdrawDetails, phoneNumber: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="0712345678"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Bank Name</label>
                      <input
                        type="text"
                        value={withdrawDetails.bankName}
                        onChange={(e) => setWithdrawDetails({...withdrawDetails, bankName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={withdrawDetails.accountNumber}
                        onChange={(e) => setWithdrawDetails({...withdrawDetails, accountNumber: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="Enter account number"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;