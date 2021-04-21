/* globals window */

import { useCookies } from "react-cookie";

const TOKEN_NAME = "AuthToken";

export const useAuthToken = () => {
  const [cookies, setCookie] = useCookies([TOKEN_NAME]);
  
  const setAuthToken = (authToken) => setCookie(TOKEN_NAME, authToken);
  const setUser = (user) => {
    if (user) {
      localStorage.setItem('email', user.email);
      localStorage.setItem('id', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('firstName', user.firstName);
      localStorage.setItem('lastName', user.lastName);
    }
  };
  const removeAuthToken = () => cookies.remove(TOKEN_NAME);
  const clearUser = () => localStorage.clear();

  return [
    cookies[TOKEN_NAME], 
    setAuthToken, 
    setUser, 
    clearUser, 
    removeAuthToken,
  ];
};