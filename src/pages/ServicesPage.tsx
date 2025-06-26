import React from 'react';
import {
  Target,
  TrendingUp,
  Shield,
  Clock,
  Users,
  DollarSign,
  Play,
  Eye,
  Gamepad2,
  Gift,
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const services = [
    {
      icon: Users,
      title: 'Referral Program',
      description:
        'Earn generous commissions with our multi-tier referral system.',
      features: [
        '200 KES for 1st level',
        '150 KES for 2nd level',
        '50 KES for 3rd level',
        'Unlimited referrals',
      ],
      color: 'from-green-600/20 to-emerald-600/20',
      borderColor: 'border-green-400/30',
      iconColor: 'text-green-400',
    },
    {
      icon: Target,
      title: 'Bet Predictions',
      description:
        'Access professional betting predictions with high accuracy rates.',
      features: [
        'Daily predictions',
        '85%+ accuracy',
        'Multiple sports',
        'Expert analysis',
      ],
      color: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-400/30',
      iconColor: 'text-blue-400',
    },
    {
      icon: TrendingUp,
      title: 'Trading Signals',
      description: 'Get premium forex trading signals and educational content.',
      features: [
        'Live signals',
        'Risk management',
        'Trading classes',
        'Market analysis',
      ],
      color: 'from-purple-600/20 to-pink-600/20',
      borderColor: 'border-purple-400/30',
      iconColor: 'text-purple-400',
    },
    {
      icon: Shield,
      title: 'Proxy Services',
      description: 'Daily free limited proxy access for secure browsing.',
      features: [
        'Daily allocation',
        'High-speed servers',
        'Multiple locations',
        'Anonymous browsing',
      ],
      color: 'from-indigo-600/20 to-blue-600/20',
      borderColor: 'border-indigo-400/30',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Play,
      title: 'Blog Posting',
      description: 'Get paid for creating quality content and engaging posts.',
      features: [
        'Per post rewards',
        'Quality bonuses',
        'Topic variety',
        'Instant payments',
      ],
      color: 'from-yellow-600/20 to-orange-600/20',
      borderColor: 'border-yellow-400/30',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Gamepad2,
      title: 'Casino Games',
      description: 'Play exciting casino games and earn rewards.',
      features: [
        'Multiple games',
        'Daily bonuses',
        'Progressive jackpots',
        'Fair gaming',
      ],
      color: 'from-red-600/20 to-pink-600/20',
      borderColor: 'border-red-400/30',
      iconColor: 'text-red-400',
    },
    {
      icon: Eye,
      title: 'Watch Ads',
      description: 'Earn money by watching targeted advertisements.',
      features: [
        'Per view payments',
        'Quality ads',
        'Daily limits',
        'Instant credits',
      ],
      color: 'from-cyan-600/20 to-blue-600/20',
      borderColor: 'border-cyan-400/30',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Clock,
      title: 'Microtasks',
      description: 'Complete simple tasks and earn instant rewards.',
      features: [
        'Quick completion',
        'Various categories',
        'Skill building',
        'Flexible timing',
      ],
      color: 'from-teal-600/20 to-green-600/20',
      borderColor: 'border-teal-400/30',
      iconColor: 'text-teal-400',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover multiple ways to earn and grow your income with Empire
            Mine's comprehensive service ecosystem
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${service.color} border ${service.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4 group-hover:bg-white/20 transition-colors">
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${service.iconColor.replace('text-', 'bg-')}`}
                    ></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              One-time activation fee unlocks all earning features
            </p>

            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-6 max-w-md mx-auto mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-400 mb-2">
                  500 KES
                </p>
                <p className="text-gray-300">One-time activation fee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Secure Payment</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Gift className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Instant Access</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">Start Earning</span>
              </div>
            </div>

            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              Activate Account Now
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sign Up</h3>
              <p className="text-gray-300 text-sm">
                Create your free Empire Mine account
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Activate
              </h3>
              <p className="text-gray-300 text-sm">
                Pay the one-time 500 KES activation fee
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Earn</h3>
              <p className="text-gray-300 text-sm">
                Start earning through multiple methods
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Withdraw
              </h3>
              <p className="text-gray-300 text-sm">
                Cash out your earnings anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
