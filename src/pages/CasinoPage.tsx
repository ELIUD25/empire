import React, { useState } from 'react';
import {
  Gamepad2,
  DollarSign,
  Trophy,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Play,
  RotateCcw,
  Crown,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

const CasinoPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeGame, setActiveGame] = useState('slots');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(50);
  const [slotResult, setSlotResult] = useState(['🍎', '🍊', '🍇']);
  const [diceResult, setDiceResult] = useState([1, 1]);
  const [cardResult, setCardResult] = useState({ player: 0, dealer: 0 });

  const games = [
    { id: 'slots', name: 'Slot Machine', icon: '🎰', minBet: 10, maxBet: 500 },
    { id: 'dice', name: 'Dice Roll', icon: '🎲', minBet: 20, maxBet: 1000 },
    {
      id: 'blackjack',
      name: 'Blackjack',
      icon: '🃏',
      minBet: 50,
      maxBet: 2000,
    },
    { id: 'roulette', name: 'Roulette', icon: '🎯', minBet: 25, maxBet: 1500 },
  ];

  const slotSymbols = ['🍎', '🍊', '🍇', '🍒', '🍋', '⭐', '💎', '👑'];

  const playSlots = async () => {
    if (!user || user.balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsPlaying(true);
    updateUser({ balance: user.balance - betAmount });

    // Simulate spinning animation
    for (let i = 0; i < 10; i++) {
      setSlotResult([
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ]);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const finalResult = [
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
    ];
    setSlotResult(finalResult);

    // Extremely low win rate - 1% chance
    let winAmount = 0;
    const winChance = Math.random();

    if (winChance < 0.01) {
      // 1% chance to win
      if (
        finalResult[0] === finalResult[1] &&
        finalResult[1] === finalResult[2]
      ) {
        if (finalResult[0] === '👑') winAmount = betAmount * 10;
        else if (finalResult[0] === '💎') winAmount = betAmount * 8;
        else if (finalResult[0] === '⭐') winAmount = betAmount * 5;
        else winAmount = betAmount * 3;
      } else if (
        finalResult[0] === finalResult[1] ||
        finalResult[1] === finalResult[2] ||
        finalResult[0] === finalResult[2]
      ) {
        winAmount = betAmount * 1.5;
      }
    }

    if (winAmount > 0) {
      updateUser({ balance: user.balance - betAmount + winAmount });
      setGameResult(`You won ${winAmount} KES!`);
    } else {
      setGameResult('Try again!');
    }

    setIsPlaying(false);
    setTimeout(() => setGameResult(null), 3000);
  };

  const playDice = async () => {
    if (!user || user.balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsPlaying(true);
    updateUser({ balance: user.balance - betAmount });

    // Simulate dice rolling
    for (let i = 0; i < 8; i++) {
      setDiceResult([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const finalDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    setDiceResult(finalDice);

    // Extremely low win rate - 1% chance
    let winAmount = 0;
    const winChance = Math.random();

    if (winChance < 0.01) {
      // 1% chance to win
      const sum = finalDice[0] + finalDice[1];
      if (sum === 7 || sum === 11) winAmount = betAmount * 2;
      else if (finalDice[0] === finalDice[1]) winAmount = betAmount * 3;
      else if (sum >= 8) winAmount = betAmount * 1.5;
    }

    if (winAmount > 0) {
      updateUser({ balance: user.balance - betAmount + winAmount });
      setGameResult(`You won ${winAmount} KES!`);
    } else {
      setGameResult('Try again!');
    }

    setIsPlaying(false);
    setTimeout(() => setGameResult(null), 3000);
  };

  const playBlackjack = async () => {
    if (!user || user.balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsPlaying(true);
    updateUser({ balance: user.balance - betAmount });

    const playerCard = Math.floor(Math.random() * 21) + 1;
    const dealerCard = Math.floor(Math.random() * 21) + 1;

    setCardResult({ player: playerCard, dealer: dealerCard });

    // Extremely low win rate - 1% chance
    let winAmount = 0;
    const winChance = Math.random();

    if (winChance < 0.01) {
      // 1% chance to win
      if (playerCard === 21) winAmount = betAmount * 2.5;
      else if (playerCard > dealerCard && playerCard <= 21)
        winAmount = betAmount * 2;
      else if (dealerCard > 21 && playerCard <= 21) winAmount = betAmount * 2;
    }

    if (winAmount > 0) {
      updateUser({ balance: user.balance - betAmount + winAmount });
      setGameResult(`You won ${winAmount} KES!`);
    } else {
      setGameResult('Dealer wins!');
    }

    setIsPlaying(false);
    setTimeout(() => setGameResult(null), 3000);
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = icons[value - 1];
    return <Icon className="h-12 w-12 text-white" />;
  };

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <Gamepad2 className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Casino Feature Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to access casino games and start playing!
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <Gamepad2 className="h-10 w-10 text-red-400" />
            <span>Empire Casino</span>
          </h1>
          <p className="text-xl text-gray-300">
            Play exciting games and test your luck!
          </p>
          <div className="mt-4 bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-orange-300 text-sm">
              <strong>Notice:</strong> Games are for entertainment. Win rates
              are very low (1%).
            </p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="h-8 w-8 text-green-400" />
            <span className="text-3xl font-bold text-white">
              {user.balance} KES
            </span>
          </div>
          <p className="text-gray-300">Your Balance</p>
        </div>

        {/* Game Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`p-6 rounded-xl border transition-all text-center ${
                activeGame === game.id
                  ? 'border-blue-400 bg-blue-600/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-4xl mb-2">{game.icon}</div>
              <h3 className="text-white font-medium">{game.name}</h3>
              <p className="text-gray-400 text-sm">
                {game.minBet}-{game.maxBet} KES
              </p>
            </button>
          ))}
        </div>

        {/* Bet Amount */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Bet Amount</h3>
            <div className="flex space-x-2">
              {[50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    betAmount === amount
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>10 KES</span>
            <span className="text-white font-medium">{betAmount} KES</span>
            <span>1000 KES</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          {activeGame === 'slots' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🎰 Slot Machine
              </h2>
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-8 mb-6">
                <div className="flex justify-center space-x-4 mb-6">
                  {slotResult.map((symbol, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-4 w-20 h-20 flex items-center justify-center"
                    >
                      <span className="text-4xl">{symbol}</span>
                    </div>
                  ))}
                </div>
                {gameResult && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
                    <p className="text-green-400 font-medium">{gameResult}</p>
                  </div>
                )}
                <button
                  onClick={playSlots}
                  disabled={isPlaying || user.balance < betAmount}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isPlaying ? (
                    <RotateCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  <span>
                    {isPlaying ? 'Spinning...' : `Spin (${betAmount} KES)`}
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                  <Crown className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <p className="text-yellow-400">👑👑👑</p>
                  <p className="text-white">10x Bet</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-center">
                  <Star className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-blue-400">💎💎💎</p>
                  <p className="text-white">8x Bet</p>
                </div>
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-3 text-center">
                  <Star className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-purple-400">⭐⭐⭐</p>
                  <p className="text-white">5x Bet</p>
                </div>
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center">
                  <Trophy className="h-6 w-6 text-green-400 mx-auto mb-1" />
                  <p className="text-green-400">Any 3</p>
                  <p className="text-white">3x Bet</p>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'dice' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🎲 Dice Roll
              </h2>
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-8 mb-6">
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    {getDiceIcon(diceResult[0])}
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    {getDiceIcon(diceResult[1])}
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-4">
                  Total: {diceResult[0] + diceResult[1]}
                </p>
                {gameResult && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
                    <p className="text-green-400 font-medium">{gameResult}</p>
                  </div>
                )}
                <button
                  onClick={playDice}
                  disabled={isPlaying || user.balance < betAmount}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isPlaying ? (
                    <RotateCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  <span>
                    {isPlaying ? 'Rolling...' : `Roll Dice (${betAmount} KES)`}
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center">
                  <p className="text-green-400 font-medium">Lucky 7 or 11</p>
                  <p className="text-white">2x Bet</p>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 font-medium">Double (Same)</p>
                  <p className="text-white">3x Bet</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-center">
                  <p className="text-blue-400 font-medium">High (8+)</p>
                  <p className="text-white">1.5x Bet</p>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'blackjack' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🃏 Blackjack
              </h2>
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-8 mb-6">
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Your Hand
                    </h3>
                    <div className="bg-white/10 rounded-lg p-6">
                      <p className="text-3xl font-bold text-white">
                        {cardResult.player}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Dealer Hand
                    </h3>
                    <div className="bg-white/10 rounded-lg p-6">
                      <p className="text-3xl font-bold text-white">
                        {cardResult.dealer}
                      </p>
                    </div>
                  </div>
                </div>
                {gameResult && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 mb-4">
                    <p className="text-green-400 font-medium">{gameResult}</p>
                  </div>
                )}
                <button
                  onClick={playBlackjack}
                  disabled={isPlaying || user.balance < betAmount}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isPlaying ? (
                    <RotateCcw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                  <span>
                    {isPlaying ? 'Dealing...' : `Deal Cards (${betAmount} KES)`}
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 font-medium">Blackjack (21)</p>
                  <p className="text-white">2.5x Bet</p>
                </div>
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center">
                  <p className="text-green-400 font-medium">Beat Dealer</p>
                  <p className="text-white">2x Bet</p>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'roulette' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-6">
                🎯 Roulette
              </h2>
              <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-400/30 rounded-xl p-8">
                <p className="text-white text-lg mb-4">Coming Soon!</p>
                <p className="text-gray-300">
                  This exciting game will be available in the next update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CasinoPage;
