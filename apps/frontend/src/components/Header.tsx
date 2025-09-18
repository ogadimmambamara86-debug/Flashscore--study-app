import React from "react";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-cyan-400 to-blue-700 bg-clip-text text-transparent">
        🚀 SPACEX MISSION CONTROL
      </h1>
      {/* You can add user info, wallet button, logout button, etc. here */}
    </div>
  );
}