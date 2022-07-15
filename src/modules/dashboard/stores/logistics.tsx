import create from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ICity {
  id: number;
  name: string;
}

export interface ILocation {
  id: number;
  name: string;
  cityId: number;
}

type LogisticsMap = { [id: number]: string };

export interface ILogistics {
  cities: {
    list: ICity[];
    map: LogisticsMap;
  };
  locations: {
    list: ILocation[];
    map: LogisticsMap;
  };
}

interface ILogisticsStore extends ILogistics {
  setParams: (key: keyof ILogistics, data: ILocation[] | ICity[]) => void;
}

const generateLabelMap = (data: ICity[] | ILocation[]) => {
  const newMap: LogisticsMap = {};
  data.forEach(({ id, name }) => {
    newMap[id] = name;
  });
  return newMap;
};

const useLogistics = create<ILogisticsStore>((set) => ({
  cities: {
    list: [],
    map: {},
  },
  locations: {
    list: [],
    map: {},
  },
  setParams: (key, data) =>
    set((state) => {
      return {
        ...state,
        [key]: {
          list: data,
          map: generateLabelMap(data),
        },
      };
    }),
}));

export default useLogistics;
