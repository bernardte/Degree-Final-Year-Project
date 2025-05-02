import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const getParam = (key: string) => params.get(key);
  console.log(getParam);
  const allParams = params;

  return { getParam, allParams };
};

export default useQueryParams;
