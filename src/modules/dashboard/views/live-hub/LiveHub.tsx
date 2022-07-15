import { Link } from '@tanstack/react-location';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axiosInstance from '_/axios';
import './LiveHub.scss';
import qs from 'qs';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState } from 'react';
import useActiveSingleItems from './useActiveSingleItems';

const columns = [
  {
    field: 'issueDate',
    header: 'Issue Date',
  },
  {
    field: 'category',
    header: 'Category',
  },
  {
    field: 'name',
    header: 'name',
  },
  {
    field: 'courier',
    header: 'Courier',
  },
];

const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

const LiveHub = () => {
  // let { data } = useActiveSingleItems();

  return (
    <div className="LiveHub">
      <h2>LiveHub</h2>
      {/* <DataTable
        value={customers1}
        paginator
        responsiveLayout="scroll"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        {columns.map((columnConfig) => {
          return <Column {...columnConfig}></Column>;
        })}
      </DataTable> */}
    </div>
  );
};

export default LiveHub;
