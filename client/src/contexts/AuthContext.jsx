// Referenced this: https://codesandbox.io/p/sandbox/navbar-auth-context-api-4mzdu8?file=%2Fsrc%2Findex.js

import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const isTokenPresent = () => {
        const access_token = localStorage.getItem('access_token');
        return !!access_token;
    };

    return (
        <AuthContext.Provider value={{ isTokenPresent }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
