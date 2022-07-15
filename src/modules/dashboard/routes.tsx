import { Route } from '@tanstack/react-location';

import LiveHub from './views/live-hub/LiveHub';
import { QUERY_KEY, getActiveSingleItems } from './views/live-hub/useActiveSingleItems';
import Layout from './views/Layout/Layout';
import ManageItems from './views/ManageItems/ManageItems';
import IssueItem from './views/ManageItems/issue-items/IssueItem';
import MoveItem from './views/ManageItems/move-items/MoveItem';
import { queryClient } from '../root/AppRoot';
import Inventory from './views/Inventory/Inventory';
import UniqueItems from './views/Inventory/UniqueItems/UniqueItems';
import axiosInstance from '_/axios';
import ManageUsers from './views/manage-users/ManageUsers';
import Create from './views/manage-users/create/Create';
import UsersList from './views/manage-users/list/UsersList';
import UserUpload from './views/manage-users/upload/UserUpload';

const routes: Route[] = [
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LiveHub />,
        // loader: () => {
        //   return queryClient.getQueryData(QUERY_KEY) ?? queryClient.fetchQuery(QUERY_KEY, getActiveSingleItems);
        // },
      },
      {
        path: '/manage-items',
        element: <ManageItems />,
        children: [
          {
            path: 'issue',
            element: <IssueItem />,
          },
          {
            path: 'move',
            element: <MoveItem />,
          },
        ],
      },
      {
        path: '/users',
        element: <ManageUsers />,
        children: [
          {
            path: 'list',
            element: <UsersList />,
          },
          {
            path: 'create',
            element: <Create />,
          },
          {
            path: 'upload',
            element: <UserUpload />,
          },
        ],
      },
      {
        path: '/inventory',
        element: <Inventory />,
        children: [
          {
            path: '/unique-items',
            element: <UniqueItems />,
          },
        ],
      },
    ],
  },
];

export default routes;
