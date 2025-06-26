import React, { useState, useEffect } from 'react';
import {
  Clock,
  DollarSign,
  CheckCircle,
  Star,
  Target,
  Zap,
  Award,
  AlertCircle,
  Gavel,
  Mic,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface Question {
  type: 'multiple' | 'text';
  question: string;
  options?: string[];
}

interface Task {
  _id: string;
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
  questions?: Question[];
  instructions?: string;
  attachments?: string[];
  deadline?: string;
  canRedo?: boolean;
  audioUrl?: string;
  isActive: boolean;
}

interface TaskSubmission {
  _id: string;
  taskId: string;
  response: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  feedback?: string;
}

const MicrotasksPage: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskResponse, setTaskResponse] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Tasks', icon: Target },
    { id: 'data-entry', name: 'Data Entry', icon: Clock },
    { id: 'surveys', name: 'Surveys', icon: CheckCircle },
    { id: 'social', name: 'Social Media', icon: Star },
    { id: 'content', name: 'Content', icon: Zap },
    { id: 'bidding', name: 'Academic/Bidding', icon: Gavel },
    { id: 'transcription', name: 'Transcription', icon: Mic },
  ];

  useEffect(() => {
    fetchTasks();
    fetchSubmissions();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const submissionsData = await apiService.getMyTaskSubmissions();
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const filteredTasks =
    activeCategory === 'all'
      ? tasks
      : tasks.filter((task) => task.category === activeCategory);

  const openTaskModal = (task: Task) => {
    const hasSubmitted = submissions.some((s) => s.taskId === task._id);

    if (hasSubmitted) {
      alert('You have already submitted this task!');
      return;
    }

    if (task.type === 'bidding' || task.type === 'transcription') {
      if (task.currentBidders! >= task.maxBidders!) {
        alert('This task has reached maximum number of bidders!');
        return;
      }
    } else {
      if (task.currentResponses! >= task.maxResponses!) {
        alert('This task has reached maximum number of responses!');
        return;
      }
    }

    setSelectedTask(task);
    setShowTaskModal(true);
    setTaskResponse('');
  };

  const submitTask = async () => {
    if (
      !selectedTask ||
      (!taskResponse.trim() && selectedTask.type !== 'survey')
    ) {
      alert('Please provide a response before submitting.');
      return;
    }

    setCompletingTask(selectedTask._id);

    try {
      await apiService.submitTask(selectedTask._id, taskResponse);

      if (
        selectedTask.type === 'bidding' ||
        selectedTask.type === 'transcription'
      ) {
        alert(
          'Your bid has been submitted! You will be notified if selected. Payment will be processed only if your work is accepted.'
        );
      } else {
        alert(
          'Task submitted successfully! Waiting for admin approval before payment is processed.'
        );
      }

      setShowTaskModal(false);
      setSelectedTask(null);
      setTaskResponse('');

      // Refresh data
      fetchTasks();
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to submit task:', error);
      alert('Failed to submit task. Please try again.');
    } finally {
      setCompletingTask(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return CheckCircle;
      case 'bidding':
        return Gavel;
      case 'transcription':
        return Mic;
      case 'task':
        return Target;
      default:
        return FileText;
    }
  };

  const canAccessTask = (task: Task) => {
    const hasSubmitted = submissions.some((s) => s.taskId === task._id);
    if (hasSubmitted) return false;

    if (task.type === 'bidding' || task.type === 'transcription') {
      return task.currentBidders! < task.maxBidders!;
    }

    return task.currentResponses! < task.maxResponses!;
  };

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <Clock className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Microtasks Feature Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to access microtasks and start earning!
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const submissionStats = {
    pending: submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    total: submissions.length,
    pendingEarnings:
      submissions.filter((s) => s.status === 'pending').length * 50, // Estimate
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <Clock className="h-10 w-10 text-purple-400" />
            <span>Microtasks</span>
          </h1>
          <p className="text-xl text-gray-300">
            Complete simple tasks and earn instant rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {submissionStats.pendingEarnings} KES
            </p>
            <p className="text-gray-300">Pending Approval</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {submissionStats.total}
            </p>
            <p className="text-gray-300">Tasks Submitted</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
            <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {submissionStats.approved}
            </p>
            <p className="text-gray-300">Approved</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6 text-center">
            <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">Bronze</p>
            <p className="text-gray-300">Current Level</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Available Tasks
              </h2>
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const TaskIcon = getTaskIcon(task.type);
                  const hasSubmitted = submissions.some(
                    (s) => s.taskId === task._id
                  );
                  const canAccess = canAccessTask(task);
                  const isBidding =
                    task.type === 'bidding' || task.type === 'transcription';

                  return (
                    <div
                      key={task._id}
                      className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-400/20 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <TaskIcon className="h-5 w-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">
                              {task.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(task.difficulty)}`}
                            >
                              {task.difficulty}
                            </span>
                            {isBidding && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                                Bidding
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {task.description}
                          </p>
                          <p className="text-gray-400 text-xs mb-3">
                            Requirements: {task.requirements}
                          </p>

                          {task.type === 'transcription' && task.audioUrl && (
                            <div className="mb-3">
                              <audio controls className="w-full">
                                <source src={task.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}

                          <div className="flex items-center space-x-4 text-sm mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-300">
                                {task.duration}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span className="text-green-400 font-medium">
                                {task.reward} KES
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-400">
                            {isBidding ? (
                              <span>
                                Bidders: {task.currentBidders}/{task.maxBidders}
                              </span>
                            ) : (
                              <span>
                                Responses: {task.currentResponses}/
                                {task.maxResponses}
                              </span>
                            )}
                            {task.deadline && (
                              <span className="ml-4">
                                Deadline: {task.deadline}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => openTaskModal(task)}
                          disabled={!canAccess || completingTask === task._id}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                            hasSubmitted
                              ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                              : !canAccess
                                ? 'bg-red-600/20 text-red-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {completingTask === task._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Processing...</span>
                            </>
                          ) : hasSubmitted ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Submitted</span>
                            </>
                          ) : !canAccess ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              <span>Limit Reached</span>
                            </>
                          ) : isBidding ? (
                            <>
                              <Gavel className="h-4 w-4" />
                              <span>Place Bid</span>
                            </>
                          ) : (
                            <>
                              <Target className="h-4 w-4" />
                              <span>Start Task</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Submissions
              </h3>
              <div className="space-y-3">
                {submissions.slice(0, 5).map((submission) => (
                  <div
                    key={submission._id}
                    className={`p-3 border rounded-lg ${
                      submission.status === 'approved'
                        ? 'bg-green-500/20 border-green-400/30'
                        : submission.status === 'pending'
                          ? 'bg-yellow-500/20 border-yellow-400/30'
                          : 'bg-red-500/20 border-red-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">
                        Task Submission
                      </h4>
                      <span
                        className={`font-medium text-sm ${
                          submission.status === 'approved'
                            ? 'text-green-400'
                            : submission.status === 'pending'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                      {submission.feedback && (
                        <span className="text-xs text-gray-300">
                          Has feedback
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Completion Rate</span>
                  <span className="text-green-400 font-medium">
                    {submissionStats.total > 0
                      ? Math.round(
                          (submissionStats.approved / submissionStats.total) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Submitted</span>
                  <span className="text-blue-400 font-medium">
                    {submissionStats.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Approved</span>
                  <span className="text-green-400 font-medium">
                    {submissionStats.approved}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pending</span>
                  <span className="text-yellow-400 font-medium">
                    {submissionStats.pending}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                {selectedTask.title}
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    {selectedTask.description}
                  </p>
                  <p className="text-blue-200 text-xs mt-2">
                    Reward: {selectedTask.reward} KES
                  </p>
                </div>

                {selectedTask.type === 'survey' && selectedTask.questions && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">
                      Survey Questions
                    </h4>
                    {selectedTask.questions.map(
                      (question: Question, index: number) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <p className="text-white mb-3">{question.question}</p>
                          {question.type === 'multiple' ? (
                            <div className="space-y-2">
                              {question.options!.map(
                                (option: string, optIndex: number) => (
                                  <label
                                    key={optIndex}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      className="text-blue-600"
                                    />
                                    <span className="text-gray-300">
                                      {option}
                                    </span>
                                  </label>
                                )
                              )}
                            </div>
                          ) : (
                            <textarea
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-20 resize-none"
                              placeholder="Your answer..."
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                {(selectedTask.type === 'bidding' ||
                  selectedTask.type === 'transcription' ||
                  selectedTask.type === 'task') && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {selectedTask.type === 'bidding'
                        ? 'Your Proposal/Bid'
                        : selectedTask.type === 'transcription'
                          ? 'Transcription'
                          : 'Task Response'}
                    </label>
                    <textarea
                      value={taskResponse}
                      onChange={(e) => setTaskResponse(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-32 resize-none"
                      placeholder={
                        selectedTask.type === 'bidding'
                          ? 'Describe your qualifications and approach...'
                          : selectedTask.type === 'transcription'
                            ? 'Type the transcription here...'
                            : 'Provide your response...'
                      }
                    />
                  </div>
                )}

                {selectedTask.type === 'bidding' && selectedTask.canRedo && (
                  <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3">
                    <p className="text-orange-300 text-sm">
                      <strong>Note:</strong> If your work is rejected, you'll
                      have a chance to redo it based on feedback. Payment is
                      only processed upon acceptance.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitTask}
                  disabled={
                    !taskResponse.trim() && selectedTask.type !== 'survey'
                  }
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTask.type === 'bidding' ||
                  selectedTask.type === 'transcription'
                    ? 'Submit Bid'
                    : 'Submit Response'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrotasksPage;
