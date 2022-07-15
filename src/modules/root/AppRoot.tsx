import AuthProvider from '../authentication/context/auth-context';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import './global.scss';
import ToastProvider from '../common/contexts/ToastContenxt';

// Create a client
export const queryClient = new QueryClient();

const AppRoot = () => {
  // Setup Providers here
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default AppRoot;
