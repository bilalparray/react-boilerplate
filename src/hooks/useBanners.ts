import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BannerApiClient } from "../api/clients/bannerApiClient";
import { storageService } from "../store/storageService";
import { CommonResponseCodeHandler } from "../api/base/helpers/common-response-code-handler.helper";
import type { BannerSM } from "../models/service/app/v1/general/bannerSM";

export function useBannerApi() {
  const navigate = useNavigate();

  const [data, setData] = useState<BannerSM[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handler = new CommonResponseCodeHandler(navigate, storageService);
    const api = new BannerApiClient(handler);

    api
      .getAllPaginated()
      .then((res) => {
        if (res.isError) {
          throw new Error(res.errorData.displayMessage);
        }
        setData(res.successData || []);
      })
      .catch((err) => {
        console.error("Banner API error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading };
}
