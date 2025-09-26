import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function AddUser() {
  // Mock hooks for demo - replace with actual imports in your real code
  const navigate = () => console.log('Navigate to home');
  
  const validationTimeoutRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: ""
  });

  const { name, username, email } = user;

  // Validation functions
  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    if (!name.trim()) return "Name is required";
    if (!namePattern.test(name)) return "Name should only contain letters and spaces";
    if (name.trim().length < 2) return "Name should be at least 2 characters long";
    if (name.trim().length > 50) return "Name should not exceed 50 characters";
    return "";
  };

  const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!username.trim()) return "Username is required";
    if (!usernamePattern.test(username)) return "Username can only contain letters, numbers, and underscores";
    if (username.length < 3) return "Username should be at least 3 characters long";
    if (username.length > 20) return "Username should not exceed 20 characters";
    if (username.startsWith('_') || username.endsWith('_')) return "Username cannot start or end with underscore";
    if (/^\d/.test(username)) return "Username cannot start with a number";
    return "";
  };

  const validateEmail = (email) => {
  if (!email.trim()) return ""; // Optional field
  
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) return "Please enter a valid email address";
  
  const commonValidDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
    'aol.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'rediffmail.com',
    'yandex.com', 'fastmail.com', 'gmx.com', 'mail.ru', 'qq.com', '163.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!commonValidDomains.includes(domain)) {
    return "Please use a common email provider like Gmail, Yahoo, Outlook, etc.";
  }
  return "";
};

  // Enhanced onInputChange with validation
  const onInputChange = (e) => {
    const { name: fieldName, value } = e.target;
    let processedValue = value;
    
    // Filter characters based on field type
    if (fieldName === 'name') {
      processedValue = value.replace(/[^A-Za-z\s]/g, '');
    }
    
    if (fieldName === 'username') {
      processedValue = value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    }
    
    // Update user data
    setUser({ ...user, [fieldName]: processedValue });
    
    // Clear any existing timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Set a new timeout for validation (debounced)
    validationTimeoutRef.current = setTimeout(() => {
      let error = "";
      switch (fieldName) {
        case 'name':
          error = validateName(processedValue);
          break;
        case 'username':
          error = validateUsername(processedValue);
          break;
        case 'email':
          error = validateEmail(processedValue);
          break;
      }
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }, 300);
  };

  const handleBlur = (e) => {
    const { name: fieldName } = e.target;
    
    // Clear timeout and validate immediately on blur
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    let error = "";
    switch (fieldName) {
      case 'name':
        error = validateName(user[fieldName]);
        break;
      case 'username':
        error = validateUsername(user[fieldName]);
        break;
      case 'email':
        error = validateEmail(user[fieldName]);
        break;
    }
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Enhanced onSubmit with validation
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    // Clear any pending validation timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Validate all fields before submission
    const newErrors = {
      name: validateName(user.name),
      username: validateUsername(user.username),
      email: validateEmail(user.email)
    };

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (hasErrors) {
      console.log("Form has errors, preventing submission");
      return false;
    }
    
    try {
      console.log("Form is valid! Submitting:", user);
      // Replace with your actual API call
      // await axios.post(`http://localhost:8080/user`, user);
      alert("User added successfully!");
      navigate("/");
    } catch (error) {
      console.error('Error adding user:', error);
      // Handle API error - maybe show error message to user
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register User
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={onInputChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={onInputChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                errors.username 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your e-mail address"
              value={email}
              onChange={onInputChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
            >
              Submit
            </button>
            <Link
              to='/'
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Debug Info */}
        {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <div>
            <strong>User Data:</strong>
            <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
          </div>
          <div className="mt-2">
            <strong>Errors:</strong>
            <pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(errors, null, 2)}</pre>
          </div>
        </div> */}
      </div>
    </div>
  );
}