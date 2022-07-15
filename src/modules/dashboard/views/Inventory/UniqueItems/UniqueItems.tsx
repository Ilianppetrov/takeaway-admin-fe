import './UniqueItems.scss';
import { useQuery } from 'react-query';
import axiosInstance from '_/axios';
import { IGenericStrapiResponse, IGenericStrapiResponseData, IUniqueItem } from '_/modules/dashboard/models';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useEffect, useMemo, useState } from 'react';
import { Ripple } from 'primereact/ripple';
import qs from 'qs';
import useItemParams, { IItemParams } from '_/modules/dashboard/stores/itemParams';
import { useMatch } from '@tanstack/react-location';
import AddItem from './AddItem/AddItem';
import useLogistics, { ILogistics } from '_/modules/dashboard/stores/logistics';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import Filters, { defaultFilters, IFilters } from './Filters/Filters';
import { Tag } from 'primereact/tag';

const transformData = (data: IGenericStrapiResponseData<IUniqueItem>[]) => {
  return data.map(({ id, attributes }) => ({ id, ...attributes }));
};

// export const getUniqueItems = async (ttest) => {
//     console.log('ttest',ttest);

//   const { data } = await axiosInstance.get<any, IResponse>('/items?populate=*');
//   console.log('single items result', data);

//   const tranformedData = transformData(data.data);

//   return { data: tranformedData, pagination: data.meta.pagination };
// };

interface IPopulatedItem extends IUniqueItem {
  category?: string;
  type?: string;
  size?: string;
  location?: string;
  city?: string;
}

interface IPagination {
  page: number;
  pageSize: number;
}

const populateItemParams = (data: IUniqueItem[], itemParams: IItemParams, logistics: ILogistics) => {
  return data.map((item) => {
    const itemCopy: IPopulatedItem = { ...item };
    itemCopy.category = itemParams.categories.map[item.categoryId];
    itemCopy.type = itemParams.types.map[item.typeId];
    itemCopy.size = itemParams.sizes.map[item.sizeId];
    itemCopy.city = logistics.cities.map[item.cityId];
    itemCopy.location = logistics.locations.map[item.locationId];

    return itemCopy;
  });
};

const parseFilters = (filters: IFilters) => {
  return Object.entries(filters).reduce((acc, curr, i) => {
    const [key, value] = curr;

    if (value === undefined || value === null) return acc;

    acc += `${i !== 0 ? '&' : ''}filters[${key}]=${value}`;
    return acc;
  }, '');
};

const parsePagination = (pagination: IPagination) => {
  return Object.entries(pagination).reduce((acc, curr, i) => {
    const [key, value] = curr;
    if (!value) return acc;

    acc += `${i !== 0 ? '&' : ''}pagination[${key}]=${value}`;
    return acc;
  }, '');
};

const useUniqueItems = ({ filters, pagination }: { filters: IFilters; pagination: IPagination }) => {
  const itemParams = useItemParams((state) => state);
  const logistics = useLogistics((state) => state);
  return useQuery(['unique-items', { filters, pagination }], async () => {
    const filtersQuery = parseFilters(filters);
    const paginationQuery = parsePagination(pagination);
    console.log('paginationQuery', paginationQuery);

    const { data } = await axiosInstance.get<IGenericStrapiResponse<IUniqueItem>>(
      `/unique-items?${paginationQuery}&${filtersQuery}`,
    );

    const tranformedData = populateItemParams(transformData(data.data), itemParams, logistics);

    return { data: tranformedData, pagination: data.meta.pagination };
  });
};

const columns = [
  {
    field: 'category',
    header: 'Category',
  },
  {
    field: 'type',
    header: 'Type',
  },
  {
    field: 'size',
    header: 'Size',
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

const UniqueItems: React.FC = () => {
  const [filters, setFilters] = useState<IFilters>(defaultFilters);

  // const setFilterByType = <T extends typeof filters, R extends keyof typeof filters>(key: R, value: T[R]) => {
  //   setFilters(
  //     produce((draft) => {
  //       draft[key] = value;
  //     }),
  //   );
  // };

  useEffect(() => {
    console.log('parent ');
  }, [setFilters]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
  });

  const { isLoading, data } = useUniqueItems({ filters, pagination });

  const template = {
    layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
    PrevPageLink: (options: any) => {
      return (
        <Button
          onClick={() => {
            setPagination((prev) => ({
              page: prev.page - 1,
              pageSize: prev.pageSize,
            }));
          }}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
      );
    },
    NextPageLink: (options: any) => {
      return (
        <Button
          onClick={() => {
            setPagination((prev) => ({
              page: prev.page + 1,
              pageSize: prev.pageSize,
            }));
          }}
          disabled={data?.pagination.pageCount === pagination.page}
        >
          Next
        </Button>
      );
    },
    RowsPerPageDropdown: (options: any) => {
      const dropdownOptions = [
        { label: 2, value: 2 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
      ];

      return (
        <Dropdown
          value={pagination.pageSize}
          options={dropdownOptions}
          onChange={(event) => setPagination({ ...pagination, pageSize: event.value })}
        />
      );
    },
    PageLinks: () => {
      return <Badge style={{ margin: '0 10px' }} size="large" value={pagination.page}></Badge>;
    },
  };

  return (
    <div className="Single-items-inventory">
      <div>
        <AddItem />
        <Filters setFilters={setFilters} />
      </div>
      {data?.data && (
        <DataTable
          loading={isLoading}
          value={data.data}
          paginator
          size="large"
          resizableColumns
          rows={pagination.pageSize}
          responsiveLayout="scroll"
          paginatorTemplate={template as any}
          first={pagination.page}
        >
          {columns.map((columnConfig) => {
            if (columnConfig?.type === 'availability') {
              return (
                <Column
                  key={columnConfig.field}
                  body={(row) => {
                    return (
                      <Tag severity={row.isAvailable ? 'success' : 'danger'}>
                        {row.isAvailable ? 'available' : 'not available'}
                      </Tag>
                    );
                  }}
                  {...columnConfig}
                ></Column>
              );
            }

            return <Column key={columnConfig.field} {...columnConfig}></Column>;
          })}
        </DataTable>
      )}
    </div>
  );
};

export default UniqueItems;
