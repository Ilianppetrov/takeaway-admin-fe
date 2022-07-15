import { Link, Outlet, useMatch, useMatchRoute, useNavigate } from '@tanstack/react-location';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '_/axios';

import './ManageUsers.scss';

const ManageUsers = () => {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const navigateTo = (to: string) => navigate({ to });

  const isRouteActive = (to: string) => !!matchRoute({ to });

  return (
    <div className="ManageUsers">
      <div className="navigation">
        <Button
          onClick={() => navigateTo('list')}
          label="Users List"
          className={`${isRouteActive('list') ? '' : 'p-button-text'}`}
        ></Button>
        <Button
          onClick={() => navigateTo('create')}
          label="Create User"
          className={`${isRouteActive('create') ? '' : 'p-button-text'}`}
        ></Button>
        <Button
          onClick={() => navigateTo('upload')}
          label="Upload Users"
          className={`${isRouteActive('upload') ? '' : 'p-button-text'}`}
        ></Button>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageUsers;
