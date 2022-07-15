import { AxiosError } from 'axios';

// Strapi
export interface IGenericStrapiResponseData<T> {
  id: number;
  attributes: Omit<T, 'id'>;
}

export interface IPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface IMetaResponse {
  date?: number;
  pagination: IPagination;
}

export interface IGenericStrapiResponse<T> {
  data: IGenericStrapiResponseData<T>[];
  meta: IMetaResponse;
}

interface IBaseItem {
  id: number;
  categoryId: number;
  typeId: number;
  sizeId: number;
  lastIssued: string;
  isAvailable: boolean;
  locationId: number;
  cityId: number;
}

export interface IUniqueItem extends IBaseItem {
  userId?: number;
}

interface StrapiError {
  data: null;
  error: {
    details: object;
    message: string;
    name: string;
    status: number;
  };
}

export type StrapiErrorResponse = AxiosError<StrapiError>;
