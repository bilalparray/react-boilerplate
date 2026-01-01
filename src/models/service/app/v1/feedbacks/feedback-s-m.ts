import { SampleServiceServiceModelBase } from '../../base/sample-service-service-model-base';

export class FeedbackSM extends SampleServiceServiceModelBase<number> {
    firstName!: string;
    lastName!: string;
    emailId!: string;
    loginId!: string;
    userAgent!: string;
    ipAddress!: string;
    reason!: string;
    overallFeedback!: string;
    rating?: number;
    isReplyRequested!: boolean;
    applicationVersion!: string;
    clientCompanyDetailId!: number;
}
