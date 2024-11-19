// module-imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';

// components
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

function Auth() {
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    }
  }, []);

  return (
    <>
      {!isOnline && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'fit-content',
            backgroundColor: 'white',
            color: 'black',
            textAlign: 'center',
            paddingTop: '6px',
            paddingBottom: '6px',
            paddingLeft: '8px',
            paddingRight: '8px',
            borderRadius: '8px',
            border: '1px solid black',
            zIndex: 9999, // Ensures the banner is on top of other elements
          }}
        >
          <div
            style={{
              backgroundColor: 'red',
              borderRadius: '50%',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WifiOffRoundedIcon style={{ color: 'white' }} />
          </div>
          <div style={{ fontWeight: 'bold', marginLeft: '8px' }}>
            You are offline
          </div>
        </div>
      )}
      {hasAccount ? (
        <Login hasAccount={hasAccount} setHasAccount={setHasAccount} />
      ) : (
        <Register hasAccount={hasAccount} setHasAccount={setHasAccount} />
      )}
    </>
  );
}

export default Auth;
