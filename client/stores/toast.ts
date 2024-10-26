import { defineStore } from "pinia";
import { ref } from "vue";

type Toast = null | {
  message: string;
  style: "success" | "error";
};

export const useToastStore = defineStore(
  "toast",
  () => {
    const toast = ref<Toast>(null);

    const showToast = (t: Toast, timeoutMs = 1500) => {
      console.log("showing toast!!");
      toast.value = t;
      setTimeout(hideToast, timeoutMs);
    };

    const hideToast = () => {
      console.log("hiding toast!");
      toast.value = null;
    };

    return {
      toast,
      showToast,
      hideToast,
    };
  },
  { persist: true },
);
