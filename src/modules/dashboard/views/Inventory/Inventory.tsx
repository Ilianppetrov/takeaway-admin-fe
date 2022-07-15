import { Link, Outlet, useMatch, useMatchRoute, useNavigate } from '@tanstack/react-location';
import { Button } from 'primereact/button';
import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from '_/axios';

import './Inventory.scss';

const Inventory = () => {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  console.log('matchRoute', matchRoute({ to: 'unique-items' }));

  const navigateTo = (to: string) => navigate({ to });

  const isRouteActive = (to: string) => !!matchRoute({ to });

  return (
    <div className="Inventory">
      {/* <h2>Inventory</h2> */}
      <div className="navigation">
        <Button
          onClick={() => navigateTo('unique-items')}
          label="Unique Items"
          className={`${isRouteActive('unique-items') ? '' : 'p-button-text'}`}
        ></Button>
        <Button
          onClick={() => navigateTo('quantitive-items')}
          label="Quantitive Items"
          className={`${isRouteActive('quantitive-items') ? '' : 'p-button-text'}`}
        ></Button>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Inventory;
