"use client";

import { toast } from "sonner";

export function useNotifications() {
  const notifySuccess = (message: string) => {
    toast.success(message, {
      duration: 5000, 
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    });
  };

  const notifyError = (message: string) => {
    toast.error(message, {
      duration: 5000, 
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    });
  };

  const notifyInfo = (message: string) => {
    toast.info(message, {
      duration: 5000,
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    });
  };

  const notifyWarning = (message: string) => {
    toast.warning(message, {
      duration: 5000, 
      style: {
        fontSize: '14px',
        fontWeight: '600',
      }
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
}
