import { Outlet } from '@tanstack/react-location';

import Navigation from '../../components/Navigation/Navigation';
import './Layout.scss';
import useLoadingData from './useLoadingData';

const Layout = () => {
  useLoadingData();

  return (
    <div className="Dashboard-container">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;
