import { WildValleyFoodsServiceModelBase } from '../../service-models/app/base/WildValleyFoods-service-model-base';

/**
 * Unit Value Service Model
 * Represents a unit of measurement (kg, g, L, ml, etc.)
 */
export class UnitValueSM extends WildValleyFoodsServiceModelBase<number> {
  unitType?: string; // Optional: "Weight", "Volume", "Length", etc.
  name!: string;
  symbol?: string;
  multiplier?: number;
  isBaseUnit!: boolean;
  displayOrder?: number;
  isActive!: boolean;
}

