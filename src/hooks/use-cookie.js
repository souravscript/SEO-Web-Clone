 "use client";  
// import { useCallback } from 'react';

// function useCookie() {
//   const setCookie = useCallback((name, value, options = {}) => {
//     const { path = '/', maxAge, secure = false, sameSite = 'strict' } = options;

//     let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; samesite=${sameSite}`;
    
//     if (maxAge) {
//       cookieString += `; max-age=${maxAge}`;
//     }
//     if (secure) {
//       cookieString += '; secure';
//     }

//     document.cookie = cookieString;
//   }, []);

//   const getCookie = useCallback((name) => {
//     const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
//       const [key, value] = cookie.split('=');
//       acc[key] = decodeURIComponent(value);
//       return acc;
//     }, {});
//     return cookies[name] || null;
//   }, []);

//   const removeCookie = useCallback((name, options = {}) => {
//     const { path = '/' } = options;
//     document.cookie = `${name}=; path=${path}; max-age=0`;
//   }, []);

//   return { setCookie, getCookie, removeCookie };
// }

// export default useCookie;


export const useCookieValue = (name) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};
