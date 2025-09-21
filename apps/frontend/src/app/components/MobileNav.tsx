// apps/frontend/src/app/components/MobileNav.tsx
"use client";
import React, { useState } from 'react';
import { useMobile } from '@hooks/useMobile';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <>
      {/* Floating menu button */}
      <button
        className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 40,
          touchAction: 'manipulation'
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 30,
              touchAction: 'none'
            }}
          />
          <div 
            className="fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-48"
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '16px',
              zIndex: 40,
              maxHeight: '70vh',
              overflow: 'auto'
            }}
          >
            <nav className="flex flex-col space-y-2">
              <a href="/scores" className="text-gray-800 hover:text-blue-600 py-2">Scores</a>
              <a href="/predictions" className="text-gray-800 hover:text-blue-600 py-2">Predictions</a>
              <a href="/forum" className="text-gray-800 hover:text-blue-600 py-2">Forum</a>
              <a href="/profile" className="text-gray-800 hover:text-blue-600 py-2">Profile</a>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNav;