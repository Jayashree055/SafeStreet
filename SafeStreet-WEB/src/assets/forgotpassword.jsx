import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/send-reset-otp', { email });
      alert(response.data.message);
      setErrorMessage('');
      setStep(2);
    } catch (error) {
      console.error("Send OTP error:", error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/update-password', {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error("Update password error:", error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='forgotpwd-container'>
      <div className='forgotpwd'>
        <div className='title'>
          <h1>Forgot Password</h1>

          {step === 1 && (
            <>
              <div className='inputs'>Personal Email:</div>
              <input
                type='text'
                placeholder='Enter your personal email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn" style={{ marginTop: '20px' }} onClick={handleSendOtp}>
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className='inputs'>OTP:</div>
              <input
                type='text'
                placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <br />

              <div className='inputs'>New Password:</div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter new password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <div
                  onClick={handleTogglePassword}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#fff',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div className='inputs'>Confirm Password:</div>
              <input
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <br />

              <button className="btn" style={{ marginTop: '20px' }} onClick={handleUpdatePassword}>
                Update Password
              </button>
            </>
          )}

          {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

