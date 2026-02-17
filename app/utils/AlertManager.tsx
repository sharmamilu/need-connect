// utils/AlertManager.tsx
import React, { createContext, useContext, useState } from "react";
import CustomAlert from "../components/common/CustomAlert";

type AlertContextType = {
  showAlert: (message: string, type: "success" | "error") => void;
};

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onHide={() => setAlert(null)}
        />
      )}
    </AlertContext.Provider>
  );
};
