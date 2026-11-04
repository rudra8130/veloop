import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('veloop_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user from server when token exists
  const fetchCurrentUser = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token expired or invalid
        localStorage.removeItem('veloop_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to authenticate token:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser(token);
  }, [token, fetchCurrentUser]);

  // Login handler
  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || 'Login failed. Please check credentials.' };
      }

      localStorage.setItem('veloop_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Could not connect to the server. Please ensure the backend is running.' };
    }
  };

  // Signup handler
  const signup = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || 'Registration failed.' };
      }

      localStorage.setItem('veloop_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Could not connect to the server. Please ensure the backend is running.' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('veloop_token');
    setToken(null);
    setUser(null);
  };

  // Enter a giveaway
  const enterGiveaway = async (giveawayId, prizeName, entryRequirement) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to enter.' };
    }

    try {
      const res = await fetch('/api/giveaways/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ giveawayId, prizeName, entryRequirement }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to enter giveaway.' };
      }

      // Update user state with updated entered giveaways
      setUser((prev) => (prev ? { ...prev, enteredGiveaways: data.enteredGiveaways } : null));

      return { success: true, message: data.message };
    } catch (err) {
      console.error('Enter giveaway error:', err);
      return { success: false, error: 'Network error. Could not record entry.' };
    }
  };

  // Submit prize claim to MongoDB
  const submitClaim = async (claimPayload) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to claim a prize.' };
    }

    try {
      const res = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(claimPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to submit claim.' };
      }

      // Update user state with updated won prizes & winner info
      if (data.user) {
        setUser((prev) => ({
          ...prev,
          ...data.user,
        }));
      }

      return { success: true, message: data.message, claim: data.claim };
    } catch (err) {
      console.error('Submit claim error:', err);
      return { success: false, error: 'Network error. Could not save claim to database.' };
    }
  };

  // Set / toggle winner status (for testing / demo)
  const setWinner = async (isWinner, prizeName, position, giveawayId, art) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/user/set-winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isWinner, prizeName, position, giveawayId, art }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message };

      if (data.user) {
        setUser((prev) => ({
          ...prev,
          ...data.user,
        }));
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Set winner error:', err);
      return { success: false, error: 'Failed to update winner status.' };
    }
  };

  const isGiveawayEntered = (giveawayId) => {
    if (!user || !user.enteredGiveaways) return false;
    return user.enteredGiveaways.some((g) => g.giveawayId === giveawayId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isWinner: Boolean(user?.isWinner || (user?.wonPrizes && user.wonPrizes.length > 0)),
        login,
        signup,
        logout,
        enterGiveaway,
        submitClaim,
        setWinner,
        isGiveawayEntered,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
