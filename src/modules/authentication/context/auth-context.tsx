import React, { createContext, useEffect } from 'react';
import { useReducer } from 'react';
import axiosInstance from '_/axios';

export interface IUser {
  id: number;
  username: string;
  email: string;
  cityId: number;
}

interface AuthState {
  user: IUser;
  isLoggedIn: boolean;
}

type Login = { type: 'login'; payload: { user: IUser; jwt: string } };
type Logout = { type: 'logout' };

type Action = Login | Logout;

interface IAuthContext {
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}

const initialState = { user: {} as IUser, isLoggedIn: false };

const AuthContext = createContext<IAuthContext>({
  state: initialState,
  dispatch: () => undefined,
});

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'login': {
      return { isLoggedIn: true, user: action.payload.user };
    }
    case 'logout': {
      localStorage.removeItem('auth');

      axiosInstance.defaults.headers.common = { Authorization: '' };
      return initialState;
    }

    default:
      throw new Error(`auth action type not registered`);
  }
};

export const useAuthContext = () => React.useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let prevSessionString = localStorage.getItem('auth');

    if (prevSessionString) {
      let prevSession = JSON.parse(prevSessionString);
      axiosInstance.defaults.headers.common = { Authorization: `bearer ${prevSession.jwt}` };
      dispatch({ type: 'login', payload: prevSession });
    }
  }, []);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
