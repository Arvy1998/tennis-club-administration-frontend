import { useCookies } from "react-cookie";

const TOKEN_NAME = "AuthToken";

/* custom hook to handle authToken - we use compositon to decouple the auth system and it's storage */
export const useAuthToken = () => {
  const [cookies, setCookie] = useCookies([TOKEN_NAME]);
  
  const setAuthToken = (authToken) => setCookie(TOKEN_NAME, authToken);
  const removeAuthToken = () => cookies.remove(TOKEN_NAME);
  
  return [cookies[TOKEN_NAME], setAuthToken, removeAuthToken];
};