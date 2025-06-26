import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Eye,
  Plus,
  Calendar,
  User,
  TrendingUp,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiService } from '../services/api.ts';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: 'pending' | 'published' | 'rejected';
  views: number;
  createdAt: string;
  feedback?: string;
}

const BlogPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('write');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [blogPost, setBlogPost] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'technology', name: 'Technology' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'business', name: 'Business' },
    { id: 'health', name: 'Health' },
    { id: 'entertainment', name: 'Entertainment' },
  ];

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchAllPosts();
    } else if (activeTab === 'my-posts') {
      fetchMyPosts();
    }
  }, [activeTab]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const posts = await apiService.getBlogPosts();
      setAllPosts(posts);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const posts = await apiService.getMyBlogPosts();
      setMyPosts(posts);
    } catch (error) {
      console.error('Failed to fetch my blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!blogPost.title || !blogPost.content) return;

    if (blogPost.content.length < 500) {
      alert('Blog post must be at least 500 characters long.');
      return;
    }

    try {
      await apiService.createBlogPost(blogPost);
      alert(
        "Blog post submitted for admin review! You will be notified once it's approved or if changes are needed."
      );
      setShowCreateModal(false);
      setBlogPost({ title: '', content: '', category: 'general' });
      if (activeTab === 'my-posts') {
        fetchMyPosts();
      }
    } catch (error) {
      console.error('Failed to create blog post:', error);
      alert('Failed to create blog post. Please try again.');
    }
  };

  const handleViewPost = () => {
    alert('Thank you for reading this post!');
  };

  if (!user?.isActivated) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-12">
            <PenTool className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Blog Feature Locked
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Activate your account to start writing blogs and sharing your
              thoughts!
            </p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-3 rounded-lg font-semibold transition-all">
              Activate Account - 500 KES
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myPostsStats = {
    total: myPosts.length,
    published: myPosts.filter((p) => p.status === 'published').length,
    pending: myPosts.filter((p) => p.status === 'pending').length,
    totalViews: myPosts.reduce((sum, p) => sum + p.views, 0),
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-2">
            <PenTool className="h-10 w-10 text-blue-400" />
            <span>Blog & Share</span>
          </h1>
          <p className="text-xl text-gray-300">
            Write quality content and share your knowledge with the community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6 text-center">
            <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {myPostsStats.totalViews}
            </p>
            <p className="text-gray-300">Total Views</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6 text-center">
            <PenTool className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {myPostsStats.total}
            </p>
            <p className="text-gray-300">Total Posts</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {myPostsStats.published}
            </p>
            <p className="text-gray-300">Published</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6 text-center">
            <AlertCircle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white mb-1">
              {myPostsStats.pending}
            </p>
            <p className="text-gray-300">Under Review</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'write', label: 'Write Blog', icon: PenTool },
              { id: 'my-posts', label: 'My Posts', icon: User },
              { id: 'browse', label: 'Browse Posts', icon: Eye },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all flex-1 justify-center ${
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

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab === 'write' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Create New Blog Post
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Writing Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">
                      Content Requirements
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Minimum 500 characters per post</li>
                      <li>• Original, high-quality content</li>
                      <li>• Proper grammar and spelling</li>
                      <li>• Relevant to chosen category</li>
                      <li>• No plagiarism or copied content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">
                      Review Process
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• All posts require admin approval</li>
                      <li>• Review typically takes 24-48 hours</li>
                      <li>• Feedback provided if rejected</li>
                      <li>• Opportunity to revise and resubmit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-posts' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                My Blog Posts
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-400/20 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">
                              {post.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                post.status === 'published'
                                  ? 'bg-green-500/20 text-green-400'
                                  : post.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-300 mb-3">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </span>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                              {post.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4 text-blue-400" />
                              <span className="text-white font-medium">
                                {post.views} views
                              </span>
                            </div>
                          </div>

                          {post.status === 'rejected' && post.feedback && (
                            <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                              <p className="text-red-300 text-sm font-medium mb-1">
                                Admin Feedback:
                              </p>
                              <p className="text-red-200 text-sm">
                                {post.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {post.status === 'rejected' && (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'browse' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Browse All Posts
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-gradient-to-br from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6 hover:scale-105 transition-all cursor-pointer"
                    >
                      <div className="mb-4">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>By {post.author}</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400">
                            {post.views} views
                          </span>
                        </div>
                        <button
                          onClick={handleViewPost}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Read Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Create New Blog Post
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={blogPost.title}
                    onChange={(e) =>
                      setBlogPost({ ...blogPost, title: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter blog post title"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={blogPost.category}
                    onChange={(e) =>
                      setBlogPost({ ...blogPost, category: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className="bg-gray-800"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={blogPost.content}
                    onChange={(e) =>
                      setBlogPost({ ...blogPost, content: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-64 resize-none"
                    placeholder="Write your blog content here... (minimum 500 characters)"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Current: {blogPost.content.length} characters
                  </p>
                </div>

                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    Your post will be reviewed by our admin team before
                    publishing. You'll receive feedback if any changes are
                    needed.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={
                    !blogPost.title ||
                    !blogPost.content ||
                    blogPost.content.length < 500
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
