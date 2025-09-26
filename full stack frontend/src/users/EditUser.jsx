import axios from "axios";
import React, { useEffect, useState , useRef} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
   let navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await axios.get(`http://localhost:8080/user/${id}`);
        setUser(result.data);
        // Clear errors when loading user data
        setErrors({ name: "", username: "", email: "" });
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, [id]);

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
    
    // Debounced validation
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

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    
    if (hasErrors) {
      console.log("Form has errors, preventing submission");
      return;
    }
    
    try {
      await axios.put(`http://localhost:8080/user/${id}`, user);
      navigate("/");
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit User</h2>

        <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
            errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter your name"
          name="name"
          value={name}
          onChange={(e) => onInputChange(e)}
          onBlur={handleBlur}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
            errors.username 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter your username"
          name="username"
          value={username}
          onChange={(e) => onInputChange(e)}
          onBlur={handleBlur}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          3-20 characters, letters, numbers, and underscores only
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          E-mail
        </label>
        <input
          type="email"
          className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
            errors.email 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter your e-mail address"
          name="email"
          value={email}
          onChange={(e) => onInputChange(e)}
          onBlur={handleBlur}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <Link
          to="/"
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
      </div>
    </div>
  );
}
