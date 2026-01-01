import { BaseViewModel } from "../../internal/base.viewmodel";
import { InputControlInformation } from "../../internal/common-models";
import { RoleTypeSM } from "../../service/app/enums/role-type-s-m.enum";
import { TokenRequestSM } from "../../service/app/token/token-request-s-m";
import { TokenResponseSM } from "../../service/app/token/token-response-s-m";
import { SocialLoginSM } from "../../service/app/v1/app-users/social-login-s-m";

export class LoginViewModel extends BaseViewModel {
  override PageTitle: string = "Sample";
  tokenRequest!: TokenRequestSM;
  tokenResponse!: TokenResponseSM;
  rolesList!: { key: RoleTypeSM; value: string }[];
  showPassword: boolean = false;
  rememberMe: boolean = true;
  socialLogin = new SocialLoginSM();

  override controlsInformation: { [key: string]: InputControlInformation } = {
    companyCode: {
      hasError: false,
      isRequired: true,
      maxlength: 6,
      minlength: 3,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "companyCode",
      placeHolder: "Company Code",
      errorMessage: "",
      validations: [
        { type: "required", message: "Company Code is Required" },
        { type: "pattern", message: "Cannot contain digits" },
        {
          type: "minlength",
          message: "Company Code must be more than 2 characters.",
        },
        {
          type: "maxlength",
          message: "Company Code must be less than 6 characters.",
        },
      ],
    },
    loginId: {
      hasError: false,
      isRequired: true,
      maxlength: 35,
      minlength: 3,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "loginId",
      placeHolder: "UserName",
      errorMessage: "",
      validations: [
        { type: "required", message: "UserId is Required" },
        { type: "pattern", message: "Cannot contain digits" },
        {
          type: "minlength",
          message: "UserName must be more than 3 characters.",
        },
        {
          type: "maxlength",
          message: "UserName must be less than 16 characters.",
        },
      ],
    },
    password: {
      controlName: "password",
      hasError: false,
      isRequired: true,
      maxlength: 16,
      minlength: 3,
      // pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@#$%^&+=!]).{8,}$",
      placeHolder: "Password",
      errorMessage: "",
      validations: [
        { type: "required", message: "Password is Required" },
        {
          type: "pattern",
          message: "Must have one: uppercase, lowercase, digit, symbol.",
        },
        {
          type: "minlength",
          message: "Password must be more than 3 characters.",
        },
        {
          type: "maxlength",
          message: "Password must be less than 16 characters.",
        },
      ],
    },
    roleType: {
      controlName: "roleType",
      hasError: false,
      isRequired: true,
      placeHolder: "Role Type",
      errorMessage: "",
      validations: [{ type: "required", message: "Please Select Role." }],
    },
    // Add more ControlInfo objects with keys as needed
  };
}
