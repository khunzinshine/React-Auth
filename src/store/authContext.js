import React, { createContext, useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainTime = (ExpireTime) => {
  const currentTime = new Date().getTime();
  const adjExpireTime = new Date(ExpireTime).getTime();
  const remainDuration = adjExpireTime - currentTime;
  return remainDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpireDate = localStorage.getItem('expireTime');
  const remainTime = calculateRemainTime(storedExpireDate);
  if (remainTime < 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expireTime');
    return null;
  }
  return { token: storedToken, duration: remainTime };
};

export const AuthContextProvider = ({ children }) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expireTime');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const handleLogin = (token, expireTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expireTime', expireTime);
    const remainTime = calculateRemainTime(expireTime);
    logoutTimer = setTimeout(handleLogout, remainTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(handleLogout, tokenData.duration);
    }
  }, [tokenData, handleLogout]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
