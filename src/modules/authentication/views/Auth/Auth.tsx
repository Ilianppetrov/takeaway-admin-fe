import { Outlet, useNavigate } from '@tanstack/react-location';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/auth-context';
import Login from '../Login/Login';

interface IFormState {
  email: string;
  password: string;
}

export const Auth = () => {
  const {
    state: { isLoggedIn },
  } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: '/dashboard', replace: true });
    }
  }, []);

  if (isLoggedIn) {
    return <Outlet />;
  }

  return <Login />;
};

export default Auth;
