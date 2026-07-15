import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('ecoeats_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('ecoeats_user', JSON.stringify(data.user));
        // Save JWT token so AppContext can attach it as Bearer header
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        window.dispatchEvent(new Event('auth-changed'));
        return data.user;
      } else {
        throw new Error(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, phone, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('ecoeats_user', JSON.stringify(data.user));
        // Save JWT token so AppContext can attach it as Bearer header
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        window.dispatchEvent(new Event('auth-changed'));
        return data.user;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoeats_user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-changed'));
  };

  const updateProfile = async (updatedData) => {
    if (!user) return false;
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updatedData })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('ecoeats_user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      alert(`Profile update failed: ${err.message}`);
      return false;
    }
  };

  const addAddress = async (label, address) => {
    if (!user) return;
    const newAddress = {
      id: `addr-${Date.now()}`,
      label,
      address
    };
    const updatedAddresses = [...(user.savedAddresses || []), newAddress];
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  const removeAddress = async (addressId) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter(addr => addr.id !== addressId);
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  const addEcoPoints = async (points) => {
    if (!user) return;
    const newPoints = (user.ecoPoints || 0) + points;
    await updateProfile({ ecoPoints: newPoints });
  };

  const deductEcoPoints = async (points) => {
    if (!user) return;
    const newPoints = Math.max(0, (user.ecoPoints || 0) - points);
    await updateProfile({ ecoPoints: newPoints });
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, addAddress, removeAddress, addEcoPoints, deductEcoPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
