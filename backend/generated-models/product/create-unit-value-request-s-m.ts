import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Create Unit Value Request DTO
 * reqData shape for POST /api/admin/unit-values
 */
export class CreateUnitValueRequestSM extends ApiRequest<CreateUnitValueRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class CreateUnitValueRequestDataSM {
  unitType?: string;
  name!: string;
  symbol?: string;
  multiplier?: number;
  isBaseUnit?: boolean;
  displayOrder?: number;
}

