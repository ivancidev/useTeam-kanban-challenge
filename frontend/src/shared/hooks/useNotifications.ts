"use client";

import { toast } from "sonner";

export function useNotifications() {
  const notifySuccess = (message: string) => {
    toast.success(message);
  };

  const notifyError = (message: string) => {
    toast.error(message);
  };

  const notifyInfo = (message: string) => {
    toast.info(message);
  };

  const notifyWarning = (message: string) => {
    toast.warning(message);
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
}
