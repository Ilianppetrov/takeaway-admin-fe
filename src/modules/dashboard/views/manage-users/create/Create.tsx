import React, { useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './Create.scss';
import { z } from 'zod';
import { useMutation } from 'react-query';
import axiosInstance from '_/axios';
import { useToast } from '_/modules/common/contexts/ToastContenxt';
import { useNavigate } from '@tanstack/react-location';
import { useAuthContext } from '_/modules/authentication/context/auth-context';
import { AxiosError } from 'axios';
import { StrapiErrorResponse } from '_/modules/dashboard/models';

const userSchema = z.object({
  email: z.string().regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Valid email is required'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(1),
  firstName: z
    .string({
      required_error: 'First Name is required',
    })
    .min(1),
  lastName: z
    .string({
      required_error: 'lastName is required',
    })
    .min(1),
  scooberId: z
    .string({
      required_error: 'ScooberId is required',
    })
    .min(1),
  username: z.string(),
});

type TUser = z.infer<typeof userSchema>;

interface NewUser extends TUser {
  role: number;
  cityId: number;
}

const createUser = async (user: TUser) => {
  return axiosInstance.post<TUser>('/users', user);
};

export const Create = () => {
  const {
    state: { user },
  } = useAuthContext();
  const toast = useToast();
  const natigate = useNavigate();
  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      formik.resetForm();
      natigate({ to: '/dashboard/users/list', replace: true });
      toast.showToast({ severity: 'success', content: 'User added successfully ' });
    },
    onError({ response }: StrapiErrorResponse) {
      if (!response?.data) {
        console.warn(`Unknown strapi response ${JSON.stringify(response)}`);
        return;
      }

      console.log('response', response);
      const { message } = response?.data?.error;
      console.log('message', message);

      toast.showToast({ severity: 'error', content: message });
    },
  });

  const formik = useFormik<TUser>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      scooberId: '',
      username: '',
    },
    validate: (data) => {
      const result = userSchema.safeParse(data);

      if (result.success) return {};

      let errors = result.error.issues.reduce((acc, currIssue) => {
        const { path, message } = currIssue;
        let key = path[0] as keyof TUser;
        acc[key] = message;

        return acc;
      }, {} as Partial<TUser>);

      return errors;
    },
    onSubmit: (data) => {
      data.username = `${data.firstName}-${data.lastName}`;

      const newUser: NewUser = {
        ...data,
        cityId: user.cityId,
        role: 3,
      };

      createUserMutation.mutate(newUser);
    },
  });

  const isFormFieldValid = (name: keyof TUser) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: keyof TUser) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return (
    <div className="Create-user">
      {/* <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
          <h5>Registration Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
            Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without
            activation. Please check <b>{formData.email}</b> for activation instructions.
          </p>
        </div>
      </Dialog> */}

      <h3 className="label">Create</h3>
      <form onSubmit={formik.handleSubmit} className="p-fluid user-form">
        <div>
          <span className="p-float-label p-input-icon-right">
            <i className="pi pi-envelope" />
            <InputText
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('email') })}
            />
            <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>
              Email*
            </label>
          </span>
          {getFormErrorMessage('email')}
        </div>
        <div className="field">
          <span className="p-float-label">
            <Password
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              toggleMask
              className={classNames({ 'p-invalid': isFormFieldValid('password') })}
              feedback={false}
            />
            <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>
              Password*
            </label>
          </span>
          {getFormErrorMessage('password')}
        </div>
        <div>
          <span className="p-float-label p-input-icon-right">
            <InputText
              id="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('firstName') })}
            />
            <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid('firstName') })}>
              First Name
            </label>
          </span>
          {getFormErrorMessage('firstName')}
        </div>
        <div>
          <span className="p-float-label p-input-icon-right">
            <InputText
              id="lastName"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('lastName') })}
            />
            <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid('lastName') })}>
              Last Name
            </label>
          </span>
          {getFormErrorMessage('lastName')}
        </div>
        <div>
          <span className="p-float-label p-input-icon-right">
            <InputText
              id="scooberId"
              name="scooberId"
              value={formik.values.scooberId}
              onChange={formik.handleChange}
              className={classNames({ 'p-invalid': isFormFieldValid('scooberId') })}
            />
            <label htmlFor="scooberId" className={classNames({ 'p-error': isFormFieldValid('scooberId') })}>
              Last Name
            </label>
          </span>
          {getFormErrorMessage('scooberId')}
        </div>
        <Button loading={createUserMutation.isLoading} type="submit" label="Submit" className="mt-2" />
      </form>
    </div>
  );
};

export default Create;
