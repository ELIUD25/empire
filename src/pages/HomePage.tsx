import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Users, TrendingUp, Shield, Zap, Target, Play, Eye, Clock, Gamepad2 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to <span className="text-yellow-400">Empire Mine</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your gateway to earning through referrals, gaming, trading, and premium services. 
              Start building your empire today!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Start Earning Now
            </Link>
            <Link
              to="/services"
              className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Explore Services
            </Link>
          </div>

          {/* Activation Fee Notice */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-2">Professional Activation</h3>
            <p className="text-gray-300 mb-4">
              One-time activation fee of <span className="text-yellow-400 font-bold">500 KES</span> unlocks all earning features
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referral System */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Multi-Tier Referral System</h2>
            <p className="text-xl text-gray-300">Earn generous commissions for every person you refer</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1st</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">First Referral</h3>
              <p className="text-3xl font-bold text-green-400 mb-2">250 KES</p>
              <p className="text-gray-300">For each direct referral</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2nd</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Second Referral</h3>
              <p className="text-3xl font-bold text-blue-400 mb-2">100 KES</p>
              <p className="text-gray-300">For each second-level referral</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3rd</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Third Referral</h3>
              <p className="text-3xl font-bold text-purple-400 mb-2">50 KES</p>
              <p className="text-gray-300">For each third-level referral</p>
            </div>
          </div>
        </div>
      </section>

      {/* Earning Methods */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Multiple Ways to Earn</h2>
            <p className="text-xl text-gray-300">Diversify your income with our comprehensive earning platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Referral Rewards</h3>
              <p className="text-gray-300 text-sm">Earn up to 250 KES per referral with our multi-tier system</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Play className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Blog Posting</h3>
              <p className="text-gray-300 text-sm">Get paid for creating quality content and engaging posts</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Gamepad2 className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Casino Games</h3>
              <p className="text-gray-300 text-sm">Play exciting casino games and earn rewards</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Watch Ads</h3>
              <p className="text-gray-300 text-sm">Earn money by watching targeted advertisements</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Microtasks</h3>
              <p className="text-gray-300 text-sm">Complete simple tasks and earn instant rewards</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Target className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Bet Predictions</h3>
              <p className="text-gray-300 text-sm">Access free professional betting predictions daily</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Trading Signals</h3>
              <p className="text-gray-300 text-sm">Get free trading signals and educational classes</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <Shield className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Proxy Service</h3>
              <p className="text-gray-300 text-sm">Access daily free limited proxy services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15,000+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">2.5M+</div>
              <div className="text-gray-300">KES Paid Out</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Daily Signals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Empire?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful earners and start your journey to financial freedom
            </p>
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-12 py-4 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <Crown className="h-6 w-6" />
              <span>Join Empire Mine</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;