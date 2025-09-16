export class Crop {
  constructor(
    public readonly id: string,
    public readonly farmId: string,
    public readonly name: string,
    public readonly variety: string,
    public readonly plantingDate: Date,
    public readonly expectedHarvestDate: Date,
    public readonly area: number,
    public readonly expectedYield: number,
    public readonly status: CropStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly notes?: string,
  ) {}

  static create(props: {
    id: string;
    farmId: string;
    name: string;
    variety: string;
    plantingDate: Date;
    expectedHarvestDate: Date;
    area: number;
    expectedYield: number;
    notes?: string;
  }): Crop {
    return new Crop(
      props.id,
      props.farmId,
      props.name,
      props.variety,
      props.plantingDate,
      props.expectedHarvestDate,
      props.area,
      props.expectedYield,
      CropStatus.PLANTED,
      new Date(),
      new Date(),
      props.notes,
    );
  }

  updateCrop(updates: Partial<{
    name: string;
    variety: string;
    expectedHarvestDate: Date;
    area: number;
    expectedYield: number;
    status: CropStatus;
    notes: string;
  }>): Crop {
    return new Crop(
      this.id,
      this.farmId,
      updates.name ?? this.name,
      updates.variety ?? this.variety,
      this.plantingDate,
      updates.expectedHarvestDate ?? this.expectedHarvestDate,
      updates.area ?? this.area,
      updates.expectedYield ?? this.expectedYield,
      updates.status ?? this.status,
      this.createdAt,
      new Date(),
      updates.notes ?? this.notes,
    );
  }

  harvest(): Crop {
    return new Crop(
      this.id,
      this.farmId,
      this.name,
      this.variety,
      this.plantingDate,
      this.expectedHarvestDate,
      this.area,
      this.expectedYield,
      CropStatus.HARVESTED,
      this.createdAt,
      new Date(),
      this.notes,
    );
  }
}

export enum CropStatus {
  PLANNED = 'planned',
  PLANTED = 'planted',
  GROWING = 'growing',
  READY_FOR_HARVEST = 'ready_for_harvest',
  HARVESTED = 'harvested',
  FAILED = 'failed',
}
