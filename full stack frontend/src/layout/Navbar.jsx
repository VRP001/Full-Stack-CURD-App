import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Brand */}
      <Link to="/" className="text-xl font-semibold">
        Full Stack Application
      </Link>

      {/* Add User Button */}
      <Link
        to="/adduser"
        className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
      >
        Add User
      </Link>
    </nav>
  );
}
