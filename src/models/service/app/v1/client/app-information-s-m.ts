import { ApplicationTypeSM } from '../../enums/application-type-s-m.enum';

export class AppInformationSM {
    minimumVersion!: string;
    latestVersion!: string;
    playStoreLink!: string;
    appStoreLink!: string;
    applicationType!: ApplicationTypeSM;
    showOnCreditApplication!: boolean;
    applicationId!: string;
}
