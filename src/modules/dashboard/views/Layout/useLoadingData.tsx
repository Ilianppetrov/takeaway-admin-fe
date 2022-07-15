import { AxiosResponse } from 'axios';
import { useQueries } from 'react-query';
import axiosInstance from '_/axios';
import { useAuthContext } from '_/modules/authentication/context/auth-context';
import { IGenericStrapiResponse } from '../../models';
import useItemParams, { ICategory, ISize, IType } from '../../stores/itemParams';
import useLogistics, { ILocation, ICity } from '../../stores/logistics';

const transformStrapiReponse = <T extends object>(data: any[]): T[] => {
  return data.map(({ id, attributes }) => ({ id, ...attributes }));
};

const useLoadingData = () => {
  const {
    state: { user },
  } = useAuthContext();
  const setItemParams = useItemParams((state) => state.setParams);
  const setLogistics = useLogistics((state) => state.setParams);

  const queries = useQueries([
    {
      queryKey: ['cities'],
      queryFn: () => axiosInstance.get(`/cities`),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: AxiosResponse<IGenericStrapiResponse<ICity>>) => {
        let cities: ICity[] = transformStrapiReponse(data.data);
        setLogistics('cities', cities);
      },
    },
    {
      queryKey: ['location', user.cityId],
      queryFn: () => axiosInstance.get(`/locations?filters[cityId]=${user.cityId}`),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: AxiosResponse<IGenericStrapiResponse<ILocation>>) => {
        let locations: ILocation[] = transformStrapiReponse(data.data);
        setLogistics('locations', locations);
      },
    },
    {
      queryKey: ['categories'],
      queryFn: () => axiosInstance.get<IGenericStrapiResponse<ICategory>>(`/categories`),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: AxiosResponse<IGenericStrapiResponse<ICategory>>) => {
        let categories: ICategory[] = transformStrapiReponse(data.data);
        setItemParams('categories', categories);
      },
    },
    {
      queryKey: ['types'],
      queryFn: () => axiosInstance.get<IGenericStrapiResponse<IType>>(`/types`),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: AxiosResponse<IGenericStrapiResponse<IType>>) => {
        let types: IType[] = transformStrapiReponse(data.data);
        setItemParams('types', types);
      },
    },
    {
      queryKey: ['sizes'],
      queryFn: () => axiosInstance.get<IGenericStrapiResponse<ISize>>(`/sizes`),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: ({ data }: AxiosResponse<IGenericStrapiResponse<ISize>>) => {
        let sizes: ISize[] = transformStrapiReponse(data.data);
        setItemParams('sizes', sizes);
      },
    },
  ]);

  return queries;
};

export default useLoadingData;
