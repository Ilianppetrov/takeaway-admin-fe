import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { z } from 'zod';
import axiosInstance from '_/axios';

const UsersSchema = z.array(
  z.object({
    blocked: z.boolean(),
    cityId: z.number(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    scooberId: z.string(),
    id: z.number(),
    role: z.object({
      description: z.string(),
      id: z.number(),
      name: z.string(),
      type: z.string(),
    }),
  }),
);

const columns = [
  {
    field: 'email',
    header: 'Email',
  },
  {
    field: 'firstName',
    header: 'First Name',
  },
  {
    field: 'lastName',
    header: 'Last Name',
  },
  {
    field: 'city',
    header: 'City',
  },
  {
    field: 'location',
    header: 'Location',
  },
  {
    field: 'isAvailable',
    header: 'Availability',
    type: 'availability',
  },
];

export type TUser = z.infer<typeof UsersSchema>[number];

const useUsers = () => {
  return useQuery(['users'], async () => {
    const { data } = await axiosInstance.get(`/users?populate=*&filters[role]=3`);

    console.log('data', data);
    let parsedData = UsersSchema.parse(data);
    console.log('parsedData', parsedData);

    return parsedData;
  });
};

const UsersList = () => {
  let usersQuery = useUsers();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  return (
    <div>
      {usersQuery.isLoading ? (
        'Loading ...'
      ) : !usersQuery.data ? null : (
        <DataTable
          value={usersQuery.data}
          paginator
          size="large"
          resizableColumns
          rows={pagination.pageSize}
          responsiveLayout="scroll"
          first={pagination.page}
        >
          {columns.map((columnConfig) => {
            return <Column key={columnConfig.field} {...columnConfig}></Column>;
          })}
        </DataTable>
      )}
    </div>
  );
};

export default UsersList;
