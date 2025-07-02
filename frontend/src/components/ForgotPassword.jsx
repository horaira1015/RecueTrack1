import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5553/api/authe/forgot-password', {
        email,
      });

      if (res.data.success) {
        setMessage(res.data.message || 'Password reset link sent to your email.');
      } else {
        setErrorMessage(res.data.message || 'Could not process your request.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light vh-100 vw-100">
      <div className="bg-white p-4 rounded w-25 shadow">
        <h2 className="text-center">Forgot Password</h2>

        {message && <p className="text-success text-center">{message}</p>}
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Send Reset Link
          </button>
        </form>

        <p className="mt-3 text-center">
          Go back to <Link to='/login' className="text-dark font-weight-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
