import { Link, Outlet } from '@tanstack/react-location';
import { useQuery } from 'react-query';
import axiosInstance from '_/axios';
import './ManageItems.scss';

const ManageItems = () => {
  return (
    <div className="ManageItems">
      <div>
        <Link to="issue">Issue Item</Link>
        <Link to="move">Move Item</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default ManageItems;
