import { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastType } from "./Toast";
import PortalHelper from "../portal/PortalHelper";

type ToastItem = { id: string, type: ToastType, message: string };
interface Context { showToast: (type: ToastType, message: string) => void; }

const ToastContext = createContext<Context | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be inside ToastProvider")
        return context.showToast;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (type: ToastType, message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter(t => t.id !== id)), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
         {children}
         <PortalHelper>
          <div
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              zIndex: 1000,
            }}
          >
            {toasts.map(({ id, type, message }) => (
              <Toast key={id} type={type} message={message} />
            ))}
          </div>
         </PortalHelper>
       </ToastContext.Provider>
    );
};