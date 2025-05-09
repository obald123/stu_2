import React from 'react';
import Image from 'next/image';
import styles from './GoogleSignInButton.module.css';

const GoogleSignInButton: React.FC = () => {
  const handleSignIn = () => {
    // Redirect to the backend's Google OAuth login endpoint
    window.location.href = 'http://localhost:8000/api/auth/google';
  };

  return (
    <button className={styles.googleButton} onClick={handleSignIn}>
      <Image
        src="/logo.svg"
        alt="Google Logo"
        width={20}
        height={20}
        className={styles.googleLogo}
      />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
