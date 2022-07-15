import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import './AddItem.scss';

import { z } from 'zod';

import React, { useState } from 'react';
import useItemParams from '_/modules/dashboard/stores/itemParams';
import useLogistics from '_/modules/dashboard/stores/logistics';
import { useMutation } from 'react-query';
import axiosInstance from '_/axios';
import { useAuthContext } from '_/modules/authentication/context/auth-context';
import { useToast } from '_/modules/common/contexts/ToastContenxt';
import { useQueryClient } from 'react-query';

const initialValues = {
  categoryId: 0,
  typeId: 0,
  sizeId: 0,
  locationId: 0,
};

const uniqueItemSchema = z.object({
  categoryId: z.number(),
  typeId: z.number(),
  sizeId: z.number(),
  locationId: z.number(),
  cityId: z.number(),
});

const AddItem = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    state: { user },
  } = useAuthContext();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { categories, types, sizes } = useItemParams();
  const { locations } = useLogistics();

  const itemMutation = useMutation(
    (item: z.TypeOf<typeof uniqueItemSchema>) => {
      return axiosInstance.post('/unique-items', {
        data: item,
      });
    },
    {
      onSuccess() {
        setIsVisible(false);
        formik.resetForm();
        toast.showToast({ severity: 'success', summary: 'Item added successfully' });
        queryClient.invalidateQueries('unique-items');
      },
    },
  );

  const formik = useFormik<Omit<z.TypeOf<typeof uniqueItemSchema>, 'cityId'>>({
    initialValues,
    onSubmit: (data) => {
      if (!user?.cityId) return;

      itemMutation.mutate({
        ...data,
        cityId: user?.cityId,
      });
    },
  });

  const show = () => setIsVisible(true);
  const hide = () => {
    setIsVisible(false);
    formik.resetForm();
  };

  const isSubmitDisabled = !Object.values(formik.values).every((value) => !!value);

  return (
    <>
      <Button label="Add" onClick={show} />
      <Dialog
        className="Add-new-unique-item-dialog"
        header="Add new unique item"
        visible={isVisible}
        onHide={hide}
        style={{ width: '50vw' }}
      >
        <span className="p-float-label">
          <Dropdown
            {...{
              id: 'categoryId',
              value: formik.values.categoryId,
              onChange: formik.handleChange,
              options: categories.list
                .filter(({ itemType }) => itemType === 'unique')
                .map(({ id, name }) => ({ label: name, value: id })),
            }}
          />
          <label htmlFor="categoryId">Category</label>
        </span>
        <span className="p-float-label">
          <Dropdown
            {...{
              id: 'typeId',
              value: formik.values.typeId,
              onChange: formik.handleChange,
              disabled: !formik.values.categoryId,
              options: types.list
                .filter((type) => type.categoryId === formik.values.categoryId)
                .map(({ id, name }) => ({ label: name, value: id })),
            }}
          />
          <label htmlFor="typeId">Type</label>
        </span>
        <span className="p-float-label">
          <Dropdown
            {...{
              id: 'sizeId',
              value: formik.values.sizeId,
              onChange: formik.handleChange,
              disabled: !formik.values.typeId,
              options: sizes.list
                .filter((size) => size.typeId === formik.values.typeId)
                .map(({ id, name }) => ({ label: name, value: id })),
            }}
          />
          <label htmlFor="sizeId">Size</label>
        </span>
        <span className="p-float-label">
          <Dropdown
            {...{
              id: 'locationId',
              value: formik.values.locationId,
              onChange: formik.handleChange,
              options: locations.list.map(({ id, name }) => ({ label: name, value: id })),
            }}
          />
          <label htmlFor="locationId">Location</label>
        </span>
        <Button
          disabled={isSubmitDisabled}
          loading={itemMutation.isLoading}
          onClick={formik.submitForm}
          type="submit"
          label="Submit"
          className="mt-2"
        />
      </Dialog>
    </>
  );
};

export default React.memo(AddItem);
