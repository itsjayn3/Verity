// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // New student verification button
  const handleVerify = () => {
    navigate("/auth"); // uses your AuthPage route
  };

  // Returning users sign in
  const handleSignIn = () => {
    navigate("/auth"); // same AuthPage
  };

  // View portfolio / profile preview
  const handleViewPortfolio = () => {
    navigate("/complete-profile"); // protected page
  };

  return (
    <div className="bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-15 backdrop-blur-xl border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl text-white tracking-wide">VERITY</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-opacity-100 transition-all">Home</a>
              <a href="#" className="hover:text-opacity-100 transition-all">Services</a>
              <a href="#" className="hover:text-opacity-100 transition-all">About</a>
              <a href="#" className="hover:text-opacity-100 transition-all">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[700px] bg-gradient-to-br from-[#0047AB] via-[#6A0DAD] to-[#000000] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl text-white mb-6 leading-tight tracking-tight">
            Welcome to Verity.
          </h1>
          <p className="text-xl sm:text-2xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto">
            The exclusive service exchange for your campus community.
          </p>
          <button
            onClick={handleVerify}
            className="px-12 py-5 bg-gradient-to-r from-[#0047AB] via-[#00B4D8] to-[#00D4FF] text-white rounded-full text-lg hover:shadow-2xl hover:shadow-neutral-500/50 transition-all transform hover:scale-105"
          >
            Verify with @aston.ac.uk
          </button>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#000000] via-[#1a0a2e] to-[#0047AB]">
        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-8">
          {/* New Students */}
          <div className="relative group bg-white bg-opacity-10 backdrop-blur-2xl border border-neutral-300 border-opacity-60 rounded-3xl p-10 shadow-2xl hover:shadow-neutral-500/30 transition-all">
            <div className="text-center">
              <h3 className="text-3xl text-white mb-4">New Students</h3>
              <p className="text-white text-opacity-80 mb-10 leading-relaxed text-lg">
                Join a verified community of students. Share your skills, discover services, and connect with peers on campus.
              </p>
              <button
                onClick={handleVerify}
                className="w-full py-4 bg-gradient-to-r from-[#0047AB] via-[#00B4D8] to-[#00D4FF] text-white rounded-full hover:shadow-xl hover:shadow-neutral-500/50 transition-all transform hover:scale-105 text-lg"
              >
                Verify with @aston.ac.uk
              </button>
            </div>
          </div>

          {/* Returning Users */}
          <div className="relative group bg-white bg-opacity-10 backdrop-blur-2xl border border-white border-opacity-30 rounded-3xl p-10 shadow-2xl hover:shadow-neutral-500/20 transition-all">
            <div className="text-center">
              <h3 className="text-3xl text-white mb-4">Returning Users</h3>
              <p className="text-white text-opacity-80 mb-10 leading-relaxed text-lg">
                Welcome back to Verity. Access your profile, manage services, and continue building connections.
              </p>
              <button
                onClick={handleSignIn}
                className="w-full py-4 border-2 border-white text-white rounded-full hover:bg-white hover:bg-opacity-20 transition-all text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Preview */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#000000] via-[#0a0a1a] to-[#0047AB] text-center">
        <h2 className="text-5xl text-white mb-8">Your Verified Profile</h2>
        <button
          onClick={handleViewPortfolio}
          className="px-10 py-4 bg-gradient-to-r from-[#C77DFF] via-[#9D4EDD] to-[#6A0DAD] text-white rounded-full hover:shadow-xl hover:shadow-neutral-500/50 transition-all text-lg"
        >
          View Portfolio
        </button>
      </section>
    </div>
  );
};

export default LandingPage;