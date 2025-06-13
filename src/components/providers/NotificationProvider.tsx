import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <>
      {children}
      <Toaster
        gutter={8}
        containerStyle={{
          top: 20,
          zIndex: 2147483647, // Maximum possible z-index value
          position: "fixed",
        }}
        toastOptions={{
          duration: 4000,
          position: "top-right",
          style: {
            zIndex: 2147483647, // Maximum possible z-index value
            position: "fixed",
          },
        }}
      />
    </>
  );
}
