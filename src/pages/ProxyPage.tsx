import React, { useState } from 'react';
import {
  Shield,
  Globe,
  Clock,
  Zap,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react'; // Removed CheckCircle

const ProxyPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('us-east');
  const [isConnected, setIsConnected] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [copied, setCopied] = useState(false);

  const proxyLocations = [
    { id: 'us-east', name: 'US East', flag: '🇺🇸', ping: '45ms', load: 'Low' },
    {
      id: 'us-west',
      name: 'US West',
      flag: '🇺🇸',
      ping: '52ms',
      load: 'Medium',
    },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', ping: '38ms', load: 'Low' },
    { id: 'germany', name: 'Germany', flag: '🇩🇪', ping: '41ms', load: 'Low' },
    {
      id: 'singapore',
      name: 'Singapore',
      flag: '🇸🇬',
      ping: '65ms',
      load: 'Medium',
    },
    { id: 'japan', name: 'Japan', flag: '🇯🇵', ping: '78ms', load: 'High' },
  ];

  const currentProxy = {
    ip: '192.168.1.100',
    port: '8080',
    username: 'empire_user_123',
    password: 'proxy_pass_456',
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleRefresh = () => {
    // Simulate getting new proxy credentials
    setTimeRemaining(3600); // Reset to 1 hour
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <Shield className="h-10 w-10 text-blue-400" />
            <span>Proxy Services</span>
          </h1>
          <p className="text-xl text-gray-300">
            Daily free limited proxy access for secure and anonymous browsing
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {formatTime(timeRemaining)}
            </p>
            <p className="text-gray-300">Time Remaining</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6 text-center">
            <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">6</p>
            <p className="text-gray-300">Locations Available</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
            <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
            <p className="text-gray-300">Status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Proxy Locations */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Select Location
            </h2>
            <div className="space-y-3">
              {proxyLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedLocation === location.id
                      ? 'border-blue-400 bg-blue-600/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{location.flag}</span>
                      <div>
                        <p className="text-white font-medium">
                          {location.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Ping: {location.ping}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          location.load === 'Low'
                            ? 'bg-green-500/20 text-green-400'
                            : location.load === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {location.load}
                      </span>
                      {selectedLocation === location.id && (
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proxy Configuration */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Proxy Configuration
              </h2>
              <button
                onClick={handleRefresh}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                title="Refresh Proxy"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Connection Status */}
            <div
              className={`p-4 rounded-lg border mb-6 ${
                isConnected
                  ? 'border-green-400/30 bg-green-600/20'
                  : 'border-orange-400/30 bg-orange-600/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                )}
                <span
                  className={`font-medium ${
                    isConnected ? 'text-green-400' : 'text-orange-400'
                  }`}
                >
                  {isConnected ? 'Proxy Connected' : 'Proxy Disconnected'}
                </span>
              </div>
            </div>

            {/* Proxy Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Server IP
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentProxy.ip}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(currentProxy.ip)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Port</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentProxy.port}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(currentProxy.port)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Username
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={currentProxy.username}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(currentProxy.username)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Password
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={currentProxy.password}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(currentProxy.password)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                isConnected
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect to Proxy'}
            </button>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Usage Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Daily Limits
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 1 hour of free proxy access per day</li>
                <li>• Bandwidth limited to 1GB per session</li>
                <li>• Maximum 3 location changes per day</li>
                <li>• Resets at midnight UTC</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-3">
                Acceptable Use
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Web browsing and research</li>
                <li>• Accessing geo-restricted content</li>
                <li>• Privacy protection</li>
                <li>• No illegal activities or abuse</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Setup Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-2">Configure Browser</h4>
              <p className="text-sm text-gray-300">
                Set up proxy settings in your browser or system
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-2">Enter Credentials</h4>
              <p className="text-sm text-gray-300">
                Use the provided IP, port, username, and password
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-2">Start Browsing</h4>
              <p className="text-sm text-gray-300">
                Enjoy secure and anonymous internet access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProxyPage;
