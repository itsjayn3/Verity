// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toggle login/signup tabs
  const toggleTab = () => setIsLogin(!isLogin);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would integrate your auth (Supabase or whatever)
    // For now, we simulate success with a timeout
    setTimeout(() => {
      navigate("/choose-role"); // move to next step in flow
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0047AB] via-[#0056D6] to-[#003D8A] relative text-white p-12 flex-col justify-center">
        <h1 className="text-6xl font-bold mb-4">Verity</h1>
        <p className="text-xl text-blue-100 mb-8">A trusted student marketplace</p>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-users text-2xl"></i>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Connect with Students</h3>
          <p className="text-blue-100 leading-relaxed">
            Join thousands of verified students exchanging services, skills, and building meaningful connections.
          </p>
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Verity</h1>
            <p className="text-gray-600">A trusted student marketplace</p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                  isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all ${
                  !isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome back" : "Join Verity"}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your student account"
                  : "Create your verified student account"}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  University Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@university.ac.uk"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-transparent transition-all placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047AB] focus:border-transparent transition-all placeholder-gray-400"
                  required
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <button className="text-sm text-[#0047AB] hover:text-blue-700 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0047AB] to-[#0056D6] text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02]"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Social Login */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              <i className="fa-brands fa-google mr-3 text-red-500"></i>
              {isLogin ? "Sign in with Google" : "Sign up with Google"}
            </button>

            {/* Toggle Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  className="ml-1 text-[#0047AB] font-medium hover:text-blue-700 transition-colors"
                  onClick={toggleTab}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <i className="fa-solid fa-shield-alt mr-2 text-green-500"></i>
              <span>Secured by university verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}