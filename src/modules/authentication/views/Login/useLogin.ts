import { useNavigate } from '@tanstack/react-location';
import { useAuthContext, IUser } from './../../context/auth-context';
import { useMutation } from 'react-query';
import axiosInstance from '_/axios';

interface IFormState {
  email: string;
  password: string;
}

const login = async ({ email, password }: IFormState) => {
  return axiosInstance.post<IFormState, { data: { jwt: string; user: IUser } }>('/auth/local', {
    identifier: email,
    password,
  });
};

const useLogin = () => {
  const { dispatch } = useAuthContext();
  const natigate = useNavigate();

  return useMutation(login, {
    onSuccess: ({ data }) => {
      axiosInstance.defaults.headers.common = { Authorization: `bearer ${data.jwt}` };
      localStorage.setItem('auth', JSON.stringify(data));
      dispatch({ type: 'login', payload: data });
      natigate({ to: '/dashboard', replace: true });
    },
  });
};

export default useLogin;
