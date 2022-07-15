import { Router, Route, Outlet, ReactLocation, Link, useMatch, useNavigate } from '@tanstack/react-location';
import Auth from '../authentication/views/Auth/Auth';

import dashboardRoutes from '../dashboard/routes';

const privateRoutes: Route[] = [
  ...dashboardRoutes,
  {
    path: '/*',
    element: <div>Page not found</div>,
  },
];

const routes: Route[] = [
  {
    path: '/',
    element: <Auth />,
    children: privateRoutes,
  },
];

const location = new ReactLocation();

function App() {
  return (
    <Router routes={routes} location={location}>
      <Outlet />
    </Router>
  );
}

export default App;

