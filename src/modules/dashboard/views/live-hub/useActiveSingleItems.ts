import { IMetaResponse } from '../../models';
import axiosInstance from '_/axios';
import { useQuery } from 'react-query';

const parsedActiveLiveItemsData = (data: any) => {};

interface IResponse {
  data: { data: any[]; meta: IMetaResponse };
}

export const QUERY_KEY = 'active-single-items';

export const getActiveSingleItems = async () => {
  console.log('fetch active items');
  const { data } = await axiosInstance.get<any, IResponse>('/active-single-items?populate=*');
  console.log('result', data);
  return data;
};

const useActiveSingleItems = () => {
  return useQuery(QUERY_KEY, getActiveSingleItems);
};

export default useActiveSingleItems;
