import { BaseViewModel } from "../../internal/base.viewmodel";
import { InputControlInformation } from "../../internal/common-models";
import { ClientUserSM } from "../../service/app/v1/app-users/client-user-s-m";
import { SetPasswordRequestSM } from "../../service/app/v1/app-users/set-password-request-s-m";
import { UpdatePasswordRequestSM } from "../../service/app/v1/app-users/update-password-request-s-m";
export class ProfileViewModel extends BaseViewModel {
  override PageTitle: string = "Sample";
  userProfileDetails = new ClientUserSM();
  setPassword = new SetPasswordRequestSM();
  updatePassword = new UpdatePasswordRequestSM();
  confirmPassword: string = "";
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  override controlsInformation: { [key: string]: InputControlInformation } = {
    // Existing fields
    companyCode: {
      hasError: false,
      isRequired: true,
      maxlength: 6,
      minlength: 3,
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
      maxlength: 16,
      minlength: 3,
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
    confirmPassword: {
      controlName: "confirmPassword",
      hasError: false,
      isRequired: true,
      placeHolder: "Confirm Password",
      errorMessage: "",
      validations: [
        { type: "required", message: "Confirm Password is Required" },
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
    email: {
      controlName: "email",
      hasError: false,
      isRequired: true,
      maxlength: 50,
      minlength: 5,
      placeHolder: "Email Address",
      errorMessage: "",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      validations: [
        { type: "required", message: "Email is Required" },
        {
          type: "pattern",
          message: "Please enter a valid email address.",
        },
      ],
    },
    // New Fields
    firstName: {
      controlName: "firstName",
      hasError: false,
      isRequired: true,
      minlength: 1,
      maxlength: 30,
      placeHolder: "First Name",
      errorMessage: "",
      validations: [{ type: "required", message: "First Name is required." }],
    },
    lastName: {
      controlName: "lastName",
      hasError: false,
      isRequired: false,
      minlength: 1,
      maxlength: 30,
      placeHolder: "Last Name",
      errorMessage: "",
      validations: [{ type: "required", message: "Last Name is required." }],
    },
    middleName: {
      controlName: "middleName",
      hasError: false,
      isRequired: false,
      minlength: 0,
      maxlength: 30,
      placeHolder: "Middle Name",
      errorMessage: "",
      validations: [
        // Optional field. Add validation if needed.
      ],
    },
    phoneNumber: {
      controlName: "phoneNumber",
      hasError: false,
      isRequired: false,
      minlength: 10,
      maxlength: 15,
      placeHolder: "Phone Number",
      errorMessage: "",
      pattern: "^[0-9]{10,10}$",
      validations: [
        {
          type: "pattern",
          message: "Please enter a valid phone number (10 digits).",
        },
      ],
    },
    dateOfBirth: {
      controlName: "dateOfBirth",
      hasError: false,
      isRequired: false,
      placeHolder: "Date of Birth",
      errorMessage: "",
      validations: [
        { type: "required", message: "Date of birth is required." },
      ],
    },
  };
}
