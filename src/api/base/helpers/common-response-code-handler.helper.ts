import type { AxiosResponse } from "axios";
import type { IDictionaryCollection } from "../../../models/internal/Idictionary-collection";
import type { NavigateFunction } from "react-router-dom";
import type { StorageService } from "../../../store/storageService";
import { DictionaryCollection } from "../../../models/internal/dictionary-collection";
import { AppConstants } from "../../../app-constants";

export class CommonResponseCodeHandler {
  public handlerDict: IDictionaryCollection<
    string,
    (resp: AxiosResponse) => string
  >;

  private navigate: NavigateFunction;
  private storageService: StorageService;

  constructor(navigate: NavigateFunction, storageService: StorageService) {
    this.navigate = navigate;
    this.storageService = storageService;

    this.handlerDict = new DictionaryCollection<
      string,
      (resp: AxiosResponse) => string
    >();

    this.addCommonHandlers();
  }

  // ─────────────────────────────────────────────────────────────

  private addCommonHandlers() {
    this.handlerDict.Add("401", (resp: AxiosResponse) => {
      // Clear tokens
      this.storageService.removeFromStorage(
        AppConstants.DATABASE_KEYS.AUTOMATION_TOKEN
      );
      this.storageService.removeFromStorage(
        AppConstants.DATABASE_KEYS.ACCESS_TOKEN
      );

      // Navigate to login
      this.navigate(AppConstants.WEB_ROUTES.ENDUSER.LOGIN);

      // Extract display message from Axios response
      const res = resp.request?.response ?? resp.data;
      let parsed: any;

      try {
        parsed = typeof res === "string" ? JSON.parse(res) : res;
      } catch {
        parsed = null;
      }

      const displayMessage =
        parsed?.errorData?.displayMessage ||
        AppConstants.ERROR_PROMPTS.Unauthorized_User;

      return displayMessage;
    });
  }
}
