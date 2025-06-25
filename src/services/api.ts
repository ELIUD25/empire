const API_BASE_URL = import.meta.env.PROD 
  ? 'https://empire-eosin.vercel.app/api' 
  : 'http://localhost:5000/api';

interface WithdrawalDetails {
  accountNumber?: string;
  bankName?: string;
  walletAddress?: string;
  [key: string]: string | undefined;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('empire_mine_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
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
  async register(userData: { name: string; email: string; password: string; referralCode?: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
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
      body: JSON.stringify(credentials)
    });
    
    const data = await this.handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('empire_mine_token', data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async checkReferralCode(referralCode: string) {
    const response = await fetch(`${API_BASE_URL}/auth/check-referral`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ referralCode })
    });
    
    return this.handleResponse(response);
  }

  // Betting endpoints
  async getBettingTips() {
    const response = await fetch(`${API_BASE_URL}/betting/tips`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Trading endpoints
  async getTradingSignals() {
    const response = await fetch(`${API_BASE_URL}/trading/signals`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Blog endpoints
  async getBlogPosts() {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async getMyBlogPosts() {
    const response = await fetch(`${API_BASE_URL}/blog/my-posts`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async createBlogPost(postData: { title: string; content: string; category: string }) {
    const response = await fetch(`${API_BASE_URL}/blog/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(postData)
    });
    
    return this.handleResponse(response);
  }

  // Ads endpoints
  async getAdvertisements() {
    const response = await fetch(`${API_BASE_URL}/ads`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async watchAdvertisement(adId: string) {
    const response = await fetch(`${API_BASE_URL}/ads/${adId}/watch`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Tasks endpoints
  async getTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async submitTask(taskId: string, response: string) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ response })
    });
    
    return this.handleResponse(res);
  }

  async getMyTaskSubmissions() {
    const response = await fetch(`${API_BASE_URL}/tasks/my-submissions`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Financial endpoints
  async submitDepositRequest(depositData: { amount: number; mpesaMessage: string }) {
    const response = await fetch(`${API_BASE_URL}/financial/deposit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(depositData)
    });
    
    return this.handleResponse(response);
  }

  async submitWithdrawalRequest(withdrawalData: { amount: number; method: string; details: WithdrawalDetails }) {
    const response = await fetch(`${API_BASE_URL}/financial/withdraw`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(withdrawalData)
    });
    
    return this.handleResponse(response);
  }

  // User endpoints
  async activateAccount() {
    const response = await fetch(`${API_BASE_URL}/users/activate`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAdminStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem('empire_mine_token');
  }
}

export const apiService = new ApiService();