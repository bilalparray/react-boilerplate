import { ExternalLoginTypeSM } from '../../enums/external-login-type-s-m.enum';

export class SocialLoginSM {
    companyCode!: string;
    idToken!: string;
    loginType!: ExternalLoginTypeSM;
}
