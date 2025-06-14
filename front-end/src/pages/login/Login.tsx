import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Login failed');
      } else {
        const data = await res.json();
        console.log('Login successful:', data);
        // redirect or set auth state here
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <div>
        <label htmlFor="email" className="block font-semibold mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-semibold mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;

