import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';

export class ClientCompanyDetailSM extends SampleServiceServiceModelBase<number> {
    companyCode!: string;
    name!: string;
    description!: string;
    contactEmail!: string;
    companyMobileNumber!: string;
    companyWebsite!: string;
    companyLogoPath!: string;
    companyDateOfEstablishment!: Date;
    clientCompanyAddressId!: number;
}
