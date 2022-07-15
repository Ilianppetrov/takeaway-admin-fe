import create from 'zustand';

export interface IBaseItemParam {
  id: number;
  name: string;
}

export interface ICategory extends IBaseItemParam {
  itemType: 'unique' | 'quantitative';
}

export interface IType extends IBaseItemParam {
  categoryId: number;
}

export interface ISize extends IBaseItemParam {
  typeId: number;
}

type ParamsMap = { [id: number]: string };

export interface IItemParams {
  categories: {
    list: ICategory[];
    map: ParamsMap;
  };
  types: {
    list: IType[];
    map: ParamsMap;
  };
  sizes: {
    list: ISize[];
    map: ParamsMap;
  };
}

interface IItemsParamsStore extends IItemParams {
  setParams: (key: keyof IItemParams, data: ICategory[] | IType[] | ISize[]) => void;
}

const generateLabelMap = (data: ICategory[] | IType[] | ISize[]) => {
  const newMap: ParamsMap = {};
  data.forEach(({ id, name }) => {
    newMap[id] = name;
  });
  return newMap;
};

const useItemParams = create<IItemsParamsStore>((set) => ({
  categories: {
    list: [],
    map: {},
  },
  types: {
    list: [],
    map: {},
  },
  sizes: {
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

export default useItemParams;
