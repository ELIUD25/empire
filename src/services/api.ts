const API_BASE_URL = import.meta.env.PROD
  ? 'https://empire-eosin.vercel.app/api'
  : 'http://localhost:5000/api';

// Interfaces for type safety
interface BettingTip {
  _id: string;
  match: string;
  league: string;
  time: string;
  prediction: string;
  odds: string;
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
  date: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  reward: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

interface Advertisement {
  _id: string;
  title: string;
  content: string;
  reward: number;
  status: 'pending' | 'active' | 'expired';
  createdAt: string;
}

interface WithdrawalDetails {
  accountNumber?: string;
  bankName?: string;
  phoneNumber?: string;
  [key: string]: string | undefined;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  totalEarnings: number;
  referrals: number;
  referralCode: string;
  referralLink: string;
  isActivated: boolean;
  registeredAt: string;
  activatedAt?: string;
  referredBy?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

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

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('empire_mine_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await this.handleResponse(response);

    if (data.token) {
      localStorage.setItem('empire_mine_token', data.token);
    }

    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse(response);

    if (data.token) {
      localStorage.setItem('empire_mine_token', data.token);
    }

    return data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async checkReferralCode(referralCode: string) {
    const response = await fetch(`${API_BASE_URL}/auth/check-referral`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ referralCode }),
    });

    return this.handleResponse(response);
  }

  // Betting endpoints
  async getBettingTips(): Promise<BettingTip[]> {
    const response = await fetch(`${API_BASE_URL}/betting/tips`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Trading endpoints
  async getTradingSignals() {
    const response = await fetch(`${API_BASE_URL}/trading/signals`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getTradingCourses() {
    const response = await fetch(`${API_BASE_URL}/trading/courses`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMarketNews() {
    const response = await fetch(`${API_BASE_URL}/trading/news`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMarketAnalysis() {
    const response = await fetch(`${API_BASE_URL}/trading/analysis`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Blog endpoints
  async getBlogPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getMyBlogPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/blog/my-posts`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createBlogPost(postData: {
    title: string;
    content: string;
    category: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(postData),
    });

    return this.handleResponse(response);
  }

  // Ads endpoints
  async getAdvertisements(): Promise<Advertisement[]> {
    const response = await fetch(`${API_BASE_URL}/ads`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async watchAdvertisement(adId: string) {
    const response = await fetch(`${API_BASE_URL}/ads/${adId}/watch`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Tasks endpoints
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async submitTask(taskId: string, response: string) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ response }),
    });

    return this.handleResponse(res);
  }

  async getMyTaskSubmissions() {
    const response = await fetch(`${API_BASE_URL}/tasks/my-submissions`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Financial endpoints
  async submitDepositRequest(depositData: {
    amount: number;
    mpesaMessage: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/financial/deposit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(depositData),
    });

    return this.handleResponse(response);
  }

  async submitWithdrawalRequest(withdrawalData: {
    amount: number;
    method: string;
    details: WithdrawalDetails;
  }) {
    const response = await fetch(`${API_BASE_URL}/financial/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(withdrawalData),
    });

    return this.handleResponse(response);
  }

  // User endpoints
  async activateAccount() {
    const response = await fetch(`${API_BASE_URL}/users/activate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Admin - Betting
  async createBettingTip(tipData: BettingTip) {
    const response = await fetch(`${API_BASE_URL}/betting/tips`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tipData),
    });

    return this.handleResponse(response);
  }

  async updateBettingTip(id: string, tipData: Partial<BettingTip>) {
    const response = await fetch(`${API_BASE_URL}/betting/tips/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(tipData),
    });

    return this.handleResponse(response);
  }

  async deleteBettingTip(id: string) {
    const response = await fetch(`${API_BASE_URL}/betting/tips/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Admin - Blog
  async getAdminBlogPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/blog/admin/posts`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async approveBlogPost(id: string) {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async rejectBlogPost(id: string, feedback: string) {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}/reject`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ feedback }),
    });

    return this.handleResponse(response);
  }

  async deleteBlogPost(id: string) {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Admin - Tasks
  async getAdminTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks/admin/all`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminTaskSubmissions() {
    const response = await fetch(`${API_BASE_URL}/tasks/admin/submissions`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createTask(taskData: Task) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    return this.handleResponse(response);
  }

  async updateTask(id: string, taskData: Partial<Task>) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    return this.handleResponse(response);
  }

  async deleteTask(id: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async approveTaskSubmission(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/tasks/submissions/${id}/approve`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async rejectTaskSubmission(id: string, feedback: string) {
    const response = await fetch(
      `${API_BASE_URL}/tasks/submissions/${id}/reject`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ feedback }),
      }
    );

    return this.handleResponse(response);
  }

  // Admin - Ads
  async getAdminAdvertisements(): Promise<Advertisement[]> {
    const response = await fetch(`${API_BASE_URL}/ads/admin/all`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createAdvertisement(adData: Advertisement) {
    const response = await fetch(`${API_BASE_URL}/ads`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(adData),
    });

    return this.handleResponse(response);
  }

  async updateAdvertisement(id: string, adData: Partial<Advertisement>) {
    const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(adData),
    });

    return this.handleResponse(response);
  }

  async deleteAdvertisement(id: string) {
    const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Admin - Financial
  async getAdminDeposits() {
    const response = await fetch(`${API_BASE_URL}/financial/admin/deposits`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAdminWithdrawals() {
    const response = await fetch(
      `${API_BASE_URL}/financial/admin/withdrawals`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async approveDeposit(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/financial/deposit/${id}/approve`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async rejectDeposit(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/financial/deposit/${id}/reject`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async approveWithdrawal(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/financial/withdraw/${id}/approve`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  async rejectWithdrawal(id: string) {
    const response = await fetch(
      `${API_BASE_URL}/financial/withdraw/${id}/reject`,
      {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  // Admin - Users
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async banUser(id: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/ban`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    return this.handleResponse(response);
  }

  async unbanUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}/unban`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem('empire_mine_token');
  }
}

export const apiService = new ApiService();
