import produce from 'immer';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import React, { useEffect, useMemo, useState } from 'react';
import useItemParams, { IBaseItemParam } from '_/modules/dashboard/stores/itemParams';
import useLogistics from '_/modules/dashboard/stores/logistics';
import './Filters.scss';

const prepForDropdownOptions = (itemParams: IBaseItemParam[]) => {
  return itemParams.map(({ id, name }) => ({ label: name, value: id }));
};

export interface IFilters {
  categoryId: number | null;
  typeId: number | null;
  sizeId: number | null;
  locationId: number | null;
  isAvailable: boolean | null;
}

interface IFilterProps {
  //   filters: IFilters;
  setFilters: React.Dispatch<React.SetStateAction<IFilters>>;
  children?: React.ReactNode;
}

export const defaultFilters: IFilters = {
  categoryId: null,
  typeId: null,
  sizeId: null,
  locationId: null,
  isAvailable: null,
};

const Filters = ({ setFilters, children }: IFilterProps) => {
  const itemParams = useItemParams((state) => state);
  const logistics = useLogistics((state) => state);
  const [_filters, _setFilters] = useState(defaultFilters);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = itemParams.categories.list.filter(({ itemType }) => itemType === 'unique');
    return prepForDropdownOptions(uniqueCategories);
  }, [itemParams.categories.list]);

  const typeOptions = useMemo(() => {
    const types = itemParams.types.list.filter(({ categoryId }) => _filters.categoryId === categoryId);
    return prepForDropdownOptions(types);
  }, [_filters.categoryId]);

  const sizeOptions = useMemo(() => {
    const sizes = itemParams.sizes.list.filter(({ typeId }) => _filters.typeId === typeId);
    return prepForDropdownOptions(sizes);
  }, [_filters.typeId]);

  const locationOptions = useMemo(() => {
    return prepForDropdownOptions(logistics.locations.list);
  }, []);

  const availabilityOptions = [
    { label: 'Available', value: true },
    { label: 'Not Available', value: false },
  ];

  const setFilterByType = <R extends keyof IFilters>(key: R, value: IFilters[R]) => {
    _setFilters(
      produce((draft) => {
        draft[key] = value;
      }),
    );
  };

  const onChange = (e: DropdownChangeParams) => {
    const { id, value } = e.target;
    setFilterByType(id as keyof IFilters, value);
  };

  const clearFilters = (keys: (keyof IFilters)[]) => () => {
    _setFilters(
      produce((draft) => {
        keys.forEach((key) => {
          draft[key] = null;
        });
      }),
    );
  };

  const applyFilters = () => {
    setFilters(_filters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    _setFilters(defaultFilters);
  };

  console.log('render');

  return (
    <div className="Unique-items-filters">
      <h3>Filters</h3>
      <div className="filters">
        <div className="filter-wrapper">
          <label htmlFor="categoryId">Category</label>
          <div className="p-inputgroup">
            <Dropdown
              {...{
                id: 'categoryId',
                value: _filters.categoryId,
                onChange: onChange,
                options: categoryOptions,
              }}
            />
            <Button
              onClick={clearFilters(['sizeId', 'typeId', 'categoryId'])}
              icon="pi pi-times"
              className="p-button-danger"
              disabled={!_filters.categoryId}
            />
          </div>
        </div>
        <div className="filter-wrapper">
          <label htmlFor="typeId">Type</label>
          <div className="p-inputgroup">
            <Dropdown
              {...{
                id: 'typeId',
                value: _filters.typeId,
                onChange: onChange,
                options: typeOptions,
                disabled: !_filters.categoryId,
              }}
            />
            <Button
              disabled={!_filters.typeId}
              onClick={clearFilters(['sizeId', 'typeId'])}
              icon="pi pi-times"
              className="p-button-danger"
            />
          </div>
        </div>
        <div className="filter-wrapper">
          <label htmlFor="sizeId">Size</label>
          <div className="p-inputgroup">
            <Dropdown
              {...{
                id: 'sizeId',
                value: _filters.sizeId,
                onChange: onChange,
                options: sizeOptions,
                disabled: !_filters.typeId,
              }}
            />
            <Button
              disabled={!_filters.sizeId}
              onClick={clearFilters(['sizeId'])}
              icon="pi pi-times"
              className="p-button-danger"
            />
          </div>
        </div>
        <div className="filter-wrapper">
          <label htmlFor="locationId">Location</label>
          <div className="p-inputgroup">
            <Dropdown
              {...{
                id: 'locationId',
                value: _filters.locationId,
                onChange: onChange,
                options: locationOptions,
              }}
            />
            <Button
              disabled={!_filters.locationId}
              onClick={clearFilters(['locationId'])}
              icon="pi pi-times"
              className="p-button-danger"
            />
          </div>
        </div>
        <div className="filter-wrapper">
          <label htmlFor="isAvailable">Availability</label>
          <div className="p-inputgroup">
            <Dropdown
              {...{
                id: 'isAvailable',
                value: _filters.isAvailable,
                onChange: onChange,
                options: availabilityOptions,
              }}
            />
            <Button
              disabled={!_filters.isAvailable}
              onClick={clearFilters(['isAvailable'])}
              icon="pi pi-times"
              className="p-button-danger"
            />
          </div>
        </div>
      </div>
      <div className="buttons-group">
        <div>
          <Button onClick={applyFilters} label="Apply Filters" />
          <Button onClick={resetFilters} label="Reset Filters" className="p-button-secondary" />
        </div>

        <div className="children-container">{children}</div>
      </div>
    </div>
  );
};

export default React.memo(Filters);
