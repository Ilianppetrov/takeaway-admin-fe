import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import {
  FileUpload,
  FileUploadFilesParam,
  FileUploadHandlerParam,
  FileUploadSelectParams,
} from 'primereact/fileupload';
import Papa from 'papaparse';
import { useMutation } from 'react-query';
import { TUser } from '../list/UsersList';
import { useAuthContext } from '_/modules/authentication/context/auth-context';
import axiosInstance from '_/axios';

const expectedData = [
  {
    key: 'firstName',
    required: true,
  },
  {
    key: 'lastName',
    required: true,
  },
  {
    key: 'email',
    required: true,
  },
  {
    key: 'startData',
    required: true,
  },
  {
    key: 'minHours',
    required: false,
  },
  {
    key: 'scooberId',
    required: true,
  },
  {
    key: 'deliveryArea',
    required: false,
  },
];

const useUploadUsers = () => {
  const {
    state: { user },
  } = useAuthContext();

  return useMutation('upload-users-csv', async (data: string[][]) => {
    const headers = data[0];
    const numberOfColumns = headers.length;
    const content = data.slice(1, data.length);

    const parsedData: TUser[] = [];
    content.forEach((data: string[]) => {
      if (data.length !== numberOfColumns) return;

      const parsedEntry = data.reduce((acc, curr, i) => {
        const { key, required } = expectedData[i];

        if (required) {
          acc[key] = curr;
        }

        return acc;
      }, {} as any);
      parsedEntry.cityId = user.cityId;
      parsedEntry.username = `${parsedEntry.firstName}-${parsedEntry.lastName}`;
      //   parsedEntry.password = 'Test1234';
      parsedEntry.role = 3;

      parsedData.push(parsedEntry);
    });

    return axiosInstance.post('/transactions/upload-users', parsedData);
  });
};

const UserUpload = () => {
  const [usersToUpload, setUsersToUpload] = useState([]);
  const uploadUsersMutation = useUploadUsers();

  const uploadHandler = (e: FileUploadHandlerParam) => {
    if (!e.files[0]) return;

    Papa.parse(e.files[0], {
      complete({ data }: { data: string[][] }) {
        uploadUsersMutation.mutate(data);
      },
    });
  };
  const onUpload = (data: any) => {};

  return (
    <div>
      <div className="card">
        <FileUpload
          customUpload
          uploadHandler={uploadHandler}
          maxFileSize={1000000}
          onUpload={onUpload}
          emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
        />
      </div>
    </div>
  );
};

export default UserUpload;
