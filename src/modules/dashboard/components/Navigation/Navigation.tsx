import { Link, useNavigate } from '@tanstack/react-location';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import './Navigation.scss';

const navs = [
  {
    to: 'manage-items',
    label: 'Manage Items',
  },
  {
    to: 'users/list',
    label: 'Manage Users',
  },
  {
    to: 'inventory/unique-items',
    label: 'Inventory',
  },
];

import { OverlayPanel } from 'primereact/overlaypanel';

import { useRef } from 'react';
import { useAuthContext } from '_/modules/authentication/context/auth-context';

const getFirstLetter = (email: string) => {
  return email?.[0].toUpperCase();
};

const Navigation = () => {
  const navigate = useNavigate();
  const {
    dispatch,
    state: { user },
  } = useAuthContext();
  let op = useRef<OverlayPanel>(null);

  const onLogout = () => {
    dispatch({ type: 'logout' });
    navigate({ replace: true, to: '/login' });
  };

  return (
    <nav className="Navigation-container">
      <Button className="p-button-text" label="Dashboard" onClick={() => navigate({ to: '/dashboard' })}></Button>
      <div>
        {navs.map(({ to, label }) => {
          return <Button onClick={() => navigate({ to })} label={label} className="p-button-text"></Button>;
        })}
        <Avatar
          label={getFirstLetter(user?.email)}
          className="mr-2"
          size="large"
          shape="circle"
          onClick={(e) => op?.current?.toggle(e)}
        />
      </div>
      <OverlayPanel ref={op} id="Navigation-overlay-panel">
        <Button className="p-button-text" label="Logout" onClick={onLogout}></Button>
      </OverlayPanel>
    </nav>
  );
};

export default Navigation;
