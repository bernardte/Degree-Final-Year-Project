const useErrorHandling = (error: any) => {
  const message =
    error?.response?.data?.error || error?.response?.data?.message || "";

  const type =
    error?.response?.status === 403 || message.includes("Access denied")
      ? "accessDenied"
      : "serverError";

  return { message, type };
};

export default useErrorHandling;
