import React, { createContext, useContext, useRef } from 'react';
import { Toast, ToastMessageType } from 'primereact/toast';

type ShowToast = (config: ToastMessageType) => void;

const ToastContext = createContext<{ showToast: ShowToast }>({
  showToast() {},
});

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useRef<Toast>(null);

  const showToast: ShowToast = (config) => toast?.current?.show(config);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
