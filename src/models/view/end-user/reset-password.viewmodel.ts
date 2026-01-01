import { BaseViewModel } from "../../internal/base.viewmodel";
import { InputControlInformation } from "../../internal/common-models";
import { ResetPasswordRequestSM } from "../../service/app/v1/app-users/reset-password-request-s-m";

export class ResetPasswordViewModel extends BaseViewModel {
  override PageTitle: string = "Sample";
  ResetPasswordRequestSM = new ResetPasswordRequestSM();
  confirmPassword: string = "";
  // Flag to determine if the new password is visible
  showNewPassword: boolean = false;
  // Flag to determine if the confirm password is visible
  showConfirmPassword: boolean = false;
  // Flag to display success screen after reset
  resetSuccessful: boolean = false;
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
      maxlength: 29,
      minlength: 5,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "loginId",
      placeHolder: "Enter Your email or username",
      errorMessage: "",
      validations: [
        { type: "required", message: "User Name is Required" },
        { type: "pattern", message: "User Name Cannot contain whitespaces" },
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
    signupid: {
      hasError: false,
      isRequired: true,
      maxlength: 29,
      minlength: 5,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "signupid",
      placeHolder: "User Name",
      errorMessage: "",
      validations: [
        { type: "required", message: "User Name is Required" },
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
    firstName: {
      hasError: false,
      isRequired: true,
      maxlength: 16,
      minlength: 3,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "firstName",
      placeHolder: "First Name",
      errorMessage: "",
      validations: [
        { type: "required", message: "FirstName is Required" },
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
      minlength: 8,
      // pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}",

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
          message: "Password must be more than 7 characters.",
        },
        {
          type: "maxlength",
          message: "Password must be less than 16 characters.",
        },
      ],
    },
    email: {
      controlName: "email",
      hasError: false,
      isRequired: true,
      maxlength: 29,
      minlength: 7,
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",

      placeHolder: "Email Address",
      errorMessage: "",
      validations: [
        { type: "required", message: "Email is Required" },
        {
          type: "pattern",
          message: "Please Enter Valid Email Address.",
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

    newPassword: {
      hasError: false,
      isRequired: true,
      maxlength: 29,
      minlength: 5,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "newPassword",
      placeHolder: "Enter your new password",
      errorMessage: "",
      validations: [
        { type: "required", message: "New Password is Required" },
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

    confirmPassword: {
      hasError: false,
      isRequired: true,
      maxlength: 29,
      minlength: 5,
      // pattern: '[a-zA-Z][a-zA-Z ]+',
      controlName: "confirmPassword",
      placeHolder: "Confirm Your New Password",
      errorMessage: "",
      validations: [
        { type: "required", message: "Confirm Password is Required" },
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
    // Add more ControlInfo objects with keys as needed
  };
}
