import { Route } from '@tanstack/react-location';

import Login from './views/Login/Login';

const routes: Route[] = [
  {
    path: '/login',
    element: <Login />,
  },
];

export default routes;
