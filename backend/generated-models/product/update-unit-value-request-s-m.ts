import { ApiRequest } from '../../service-models/foundation/api-contracts/base/api-request';

/**
 * Update Unit Value Request DTO
 * reqData shape for PUT /api/admin/unit-values/:id
 */
export class UpdateUnitValueRequestSM extends ApiRequest<UpdateUnitValueRequestDataSM> {
  // reqData is inherited from ApiRequest<T>
}

export class UpdateUnitValueRequestDataSM {
  unitType?: string;
  name?: string;
  symbol?: string;
  multiplier?: number;
  isBaseUnit?: boolean;
  displayOrder?: number;
  isActive?: boolean;
}

