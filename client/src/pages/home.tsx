import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (!session) {
      navigate('/login');
      return;
    }

    // Get user data from session
    const sessionData = JSON.parse(session);
    setUser(sessionData.user);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('session');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">HelpHut</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              Welcome to HelpHut!
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
