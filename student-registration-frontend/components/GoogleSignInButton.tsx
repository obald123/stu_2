import React from 'react';
import Image from 'next/image';
import styles from './GoogleSignInButton.module.css';

const GoogleSignInButton: React.FC = () => {
  const handleSignIn = () => {
    // Redirect to the backend's Google OAuth login endpoint
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <button 
      className={styles.googleButton} 
      onClick={handleSignIn}
      type="button"
      aria-label="Sign in with Google"
    >
      <Image
        src="/google.svg"
        alt="Google Logo"
        width={18}
        height={18}
        className={styles.googleLogo}
        priority
      />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
