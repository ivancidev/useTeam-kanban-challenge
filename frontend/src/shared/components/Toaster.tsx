"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-left"
      richColors={false}
      expand={true}
      duration={6000}
      closeButton={true}
      visibleToasts={5}
      offset={16}
      gap={12}
      toastOptions={{
        className: 'toast-custom',
        unstyled: false,
        style: {
          marginLeft: '16px',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
        }
      }}
    />
  );
}
