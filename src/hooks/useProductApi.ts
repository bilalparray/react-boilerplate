import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storageService } from "../store/storageService";
import { CommonResponseCodeHandler } from "../api/base/helpers/common-response-code-handler.helper";
import { ProductClient } from "../api/clients/productsclient";

export function useProductApi(productId: string) {
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const handler = new CommonResponseCodeHandler(navigate, storageService);
    const api = new ProductClient(handler);

    setIsLoading(true);

    api
      .getProductById(productId)
      .then((res) => {
        if (res.isError) {
          throw new Error(res.errorData.displayMessage);
        }
        console.log(res.successData);

        setData(res.successData);
      })
      .catch((err) => {
        console.error("Product API error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  return { data, isLoading };
}
