import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USER = {
  id: 'user-888',
  name: 'Jane Eco-Citizen',
  email: 'user@ecoeats.com',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  savedAddresses: [
    { id: 'addr-1', label: 'Home 🏡', address: 'Apartment 4B, Emerald Heights, Sector 4, Green Glen Layout, Bengaluru' },
    { id: 'addr-2', label: 'Office 💼', address: 'Eco-Solutions Hub, 5th Floor, Block C, Koramangala, Bengaluru' }
  ],
  ecoPoints: 420,
  treesPlantedCount: 2
};

const MOCK_ADMIN = {
  id: 'admin-999',
  name: 'Admin Moderator',
  email: 'admin@ecoeats.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
};

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email === 'user@ecoeats.com' && password === 'password') {
        setUser(MOCK_USER);
        localStorage.setItem('ecoeats_user', JSON.stringify(MOCK_USER));
        return MOCK_USER;
      } else if (email === 'admin@ecoeats.com' && password === 'admin123') {
        setUser(MOCK_ADMIN);
        localStorage.setItem('ecoeats_user', JSON.stringify(MOCK_ADMIN));
        return MOCK_ADMIN;
      } else {
        throw new Error('Invalid email or password. Use user@ecoeats.com / password or admin@ecoeats.com / admin123');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser = {
        id: `user-${Math.floor(Math.random() * 1000)}`,
        name,
        email,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        savedAddresses: [],
        ecoPoints: 50, // Welcome points
        treesPlantedCount: 0
      };

      setUser(newUser);
      localStorage.setItem('ecoeats_user', JSON.stringify(newUser));
      return newUser;
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
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('ecoeats_user', JSON.stringify(updatedUser));
  };

  const addAddress = (label, address) => {
    if (!user) return;
    const newAddress = {
      id: `addr-${Math.floor(Math.random() * 1000)}`,
      label,
      address
    };
    const updatedAddresses = [...(user.savedAddresses || []), newAddress];
    updateProfile({ savedAddresses: updatedAddresses });
  };

  const removeAddress = (addressId) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter(addr => addr.id !== addressId);
    updateProfile({ savedAddresses: updatedAddresses });
  };

  const addEcoPoints = (points) => {
    if (!user) return;
    const newPoints = (user.ecoPoints || 0) + points;
    
    // Check if user has earned a new tree (each 200 points = 1 tree)
    const oldTrees = Math.floor((user.ecoPoints || 0) / 200);
    const newTrees = Math.floor(newPoints / 200);
    const treesEarned = newTrees - oldTrees;
    
    updateProfile({ 
      ecoPoints: newPoints,
      treesPlantedCount: (user.treesPlantedCount || 0) + (treesEarned > 0 ? treesEarned : 0)
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, addAddress, removeAddress, addEcoPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
