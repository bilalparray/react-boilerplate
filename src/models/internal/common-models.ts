import { DBSchema } from "idb";
import { RoleTypeSM } from "../service/app/enums/role-type-s-m.enum";

export interface LoaderInfo {
  message: string;
  showLoader: boolean;
}

// export interface ConfirmModalInfo {
//   title: string;
//   subTitle: string;
//   message: string;
//   showModal: boolean;
// }

export class LayoutViewModel {
  leftMenuClass!: string;
  rightMenuClass!: string;
  showRightMenu!: boolean;
  showLeftMenu!: boolean;
  showNav!: boolean;
  // userLoggedIn: boolean;
  loggedInUserType = RoleTypeSM;
  updateAvailable!: boolean;
  // initialLaunch: boolean;
  /****************feedback */
  feedbackTimerStarted: boolean = false;
  feedbackTimerStartTime: number | null = null; // Store timestamp (from Date.now())
  feedbackIntervalHandle: any = null; // Store setInterval handle
}

export interface MenuItem {
  routePath: string;
  routeName: string;
  isActive: boolean;
  iconName: boolean;
}

export interface InputControlInformation {
  controlName: string;
  hasError: boolean;
  placeHolder: string;
  errorMessage: string;
  isRequired: boolean;
  pattern?: string;
  maxlength?: number;
  minlength?: number;
  validations: ValidationMessageInformation[];
}

export interface ValidationMessageInformation {
  type: string;
  message: string;
}

export interface IndexedDBStorage extends DBSchema {
  localStorage: {
    key: string;
    value: string;
  };
  sessionStorage: {
    key: string;
    value: string;
  };
}
