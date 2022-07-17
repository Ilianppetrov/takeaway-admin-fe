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
import { IUser, useAuthContext } from '_/modules/authentication/context/auth-context';
import axiosInstance from '_/axios';
import { useToast } from '_/modules/common/contexts/ToastContenxt';
import { useNavigate } from '@tanstack/react-location';

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

const submitUsersData = (user: IUser) => async (data: string[][]) => {
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
    parsedEntry.role = 3;

    parsedData.push(parsedEntry);
  });

  return axiosInstance.post('/transactions/upload-users', parsedData);
};

const useUploadUsers = () => {
  const {
    state: { user },
  } = useAuthContext();
  const { showToast } = useToast();
  const navigateTo = useNavigate();

  return useMutation('upload-users-csv', submitUsersData(user), {
    onSuccess: () => {
      showToast({ severity: 'success', content: 'Users uploaded successfully' });
      navigateTo({ to: '/dashboard/users/list', replace: true });
    },
  });
};

const UserUpload = () => {
  const uploadUsersMutation = useUploadUsers();

  const uploadHandler = (e: FileUploadHandlerParam) => {
    if (!e.files[0]) return;

    Papa.parse(e.files[0], {
      complete({ data }: { data: string[][] }) {
        uploadUsersMutation.mutate(data);
      },
    });
  };

  return (
    <div>
      <div className="card">
        <FileUpload
          customUpload
          uploadHandler={uploadHandler}
          maxFileSize={1000000}
          emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
        />
      </div>
    </div>
  );
};

export default UserUpload;
