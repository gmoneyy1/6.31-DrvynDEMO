// API service layer for backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://six-31-drvyndemo.onrender.com');

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  timezone: string;
}

export interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
}

export interface AICommand {
  command: 'ADD' | 'REMOVE' | 'MESSAGE';
  start?: string;
  end?: string;
  title?: string;
  text?: string;
}

export interface AIResponse {
  commands: AICommand[];
}

// Authentication
export const auth = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'omit'
    });
    return response.json();
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'omit'
    });
    return response.json();
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'GET',
        credentials: 'omit'
      });
      return response.json();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getUser: async (): Promise<User> => {
    console.log('Making getUser request to:', `${API_BASE_URL}/api/user`);
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      credentials: 'omit'
    });
    console.log('getUser response status:', response.status);
    if (!response.ok) {
      console.log('getUser failed with status:', response.status);
      throw new Error('Failed to fetch user');
    }
    const userData = await response.json();
    console.log('getUser success:', userData);
    return userData;
  },

  updateTimezone: async (timezone: string) => {
    const response = await fetch(`${API_BASE_URL}/api/user/timezone`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timezone }),
      credentials: 'omit'
    });
    return response.json();
  }
};

// Events
export const events = {
  getAll: async (): Promise<{ events: Event[] }> => {
    console.log('API: Fetching events from:', `${API_BASE_URL}/api/events`);
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      credentials: 'omit'
    });
    console.log('API: Events response status:', response.status);
    if (!response.ok) {
      console.log('API: Events fetch failed with status:', response.status);
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    console.log('API: Events data received:', data);
    return data;
  },

  create: async (title: string, start: string, end: string): Promise<{ success: boolean; event: Event }> => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, start, end }),
      credentials: 'omit'
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  update: async (eventId: number, title: string, start: string, end: string): Promise<{ success: boolean; event: Event }> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, start, end }),
      credentials: 'omit'
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  delete: async (eventId: number): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      credentials: 'omit'
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    return response.json();
  }
};

// AI Chat
export const ai = {
  sendMessage: async (input: string): Promise<AIResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
      credentials: 'omit'
    });
    if (!response.ok) {
      throw new Error('Failed to send message to AI');
    }
    return response.json();
  }
};

// Utility functions
export const formatDateTime = (date: Date): string => {
  return date.toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS
};

export const parseDateTime = (isoString: string): Date => {
  return new Date(isoString);
}; 