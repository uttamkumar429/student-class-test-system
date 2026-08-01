// src/lib/toast/toastConfig.js

import { toastTheme } from "./toastTheme";

export const TOAST_CONFIG = {
  position: "top-right",

  richColors: true,

  expand: true,

  closeButton: true,

  visibleToasts: 4,

  duration: 3500,

  toastOptions: toastTheme,
};