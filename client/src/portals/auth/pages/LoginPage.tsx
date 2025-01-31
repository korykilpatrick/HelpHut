import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { Package, Users, Building2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    // Get email from URL if present (from signup redirect)
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setConfirmationMessage('Please check your email to confirm your account before logging in.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      // Navigation is handled by AuthProvider
    } catch (err: any) {
      if (err.response?.data?.error === 'Email not confirmed') {
        setError('Please confirm your email address before logging in. Check your inbox for the confirmation link.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Mission and Features */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:px-16 lg:py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="flex flex-col items-center text-center mb-8">
          <img 
            src="/helphut_logo.png"
            alt="HelpHut Logo" 
            className="h-40 w-auto mb-10"
          />
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-6 max-w-xl">
            HelpHut
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-lg">
            Join our mission to reduce food waste and fight hunger in your local community.
          </p>
        </div>
          
        <div className="grid grid-cols-1 gap-10 max-w-lg mx-auto">
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Food Donors</h3>
              <p className="text-gray-600">Easily donate surplus food and track your community impact</p>
            </div>
          </div>
            
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Volunteers</h3>
              <p className="text-gray-600">Help deliver food to those who need it most</p>
            </div>
          </div>
            
          <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partner Organizations</h3>
              <p className="text-gray-600">Receive donations and manage your food inventory efficiently</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img 
              src="/helphut_logo.png"
              alt="HelpHut Logo" 
              className="mx-auto h-24 w-auto lg:hidden"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to HelpHut
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            {confirmationMessage && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="text-sm text-blue-700">{confirmationMessage}</div>
              </div>
            )}
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 