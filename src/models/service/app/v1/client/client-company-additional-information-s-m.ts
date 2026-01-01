import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';
import { CompanyContactTypeSM } from '../../enums/company-contact-type-s-m.enum';

export class ClientCompanyAdditionalInformationSM extends SampleServiceServiceModelBase<number> {
    infoDataType!: CompanyContactTypeSM;
    description!: string;
    jsonInformation!: string;
    clientCompanyId!: number;
    sentToCompany!: boolean;
}
