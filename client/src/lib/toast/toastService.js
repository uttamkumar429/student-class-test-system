// src/lib/toast/toastService.js

import { toast } from "sonner";

class ToastService {
  success(message, options = {}) {
    return toast.success(message, options);
  }

  error(message, options = {}) {
    return toast.error(message, options);
  }

  warning(message, options = {}) {
    return toast.warning(message, options);
  }

  info(message, options = {}) {
    return toast.info(message, options);
  }

  loading(message = "Please wait...", options = {}) {
    return toast.loading(message, options);
  }

  promise(promise, messages) {
    return toast.promise(promise, messages);
  }

  dismiss(id) {
    toast.dismiss(id);
  }

  dismissAll() {
    toast.dismiss();
  }
}

const toastService = new ToastService();

export default toastService;