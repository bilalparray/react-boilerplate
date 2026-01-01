import { environment } from "src/environments/environment";
import { BaseViewModel } from "../internal/base.viewmodel";
import { AppInformationSM } from "../service/app/v1/client/app-information-s-m";

export class AppViewModel extends BaseViewModel {
  override PageTitle: string = "Reno Softwares";
  stopApplicationFlow: boolean = true;
  updateAvailable: boolean = false;
  platform!: string;
  versionInformation!: AppInformationSM;
  currentVersionOfTheApp = environment.applicationVersion;
  loading: boolean = false;
  safeArea: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  stopApplicationFlowOnUpdate: boolean = false;
  stopApplicationFlowOnApiError: boolean = false;
  internetAvailable: boolean = true;
}
