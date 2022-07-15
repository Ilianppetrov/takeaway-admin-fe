import React, { useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './Login.scss';
import useLogin from './useLogin';

interface IFormState {
  email: string;
  password: string;
}

export const Login = () => {
  const { mutate, isLoading, data } = useLogin();

  const formik = useFormik<IFormState>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (data) => {
      let errors: { email?: string; password?: string } = {};

      if (!data.email) {
        errors.email = 'Email is required.';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com';
      }

      if (!data.password) {
        errors.password = 'Password is required.';
      }

      return errors;
    },
    onSubmit: (data) => {
      mutate(data);
      formik.resetForm();
    },
  });

  const isFormFieldValid = (name: keyof IFormState) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: keyof IFormState) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return (
    <div className="Login-container">
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

      <div className="card">
        <h5 className="text-center mr-2">Login</h5>
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="field">
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
          <Button loading={isLoading} type="submit" label="Submit" className="mt-2" />
        </form>
      </div>
    </div>
  );
};

export default Login;
