export class Farm {
  constructor(
    public readonly id: string,
    public readonly farmerId: string,
    public readonly name: string,
    public readonly location: FarmLocation,
    public readonly totalArea: number,
    public readonly arableArea: number,
    public readonly soilType: SoilType,
    public readonly irrigationSystem: IrrigationSystem,
    public readonly certifications: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    farmerId: string;
    name: string;
    location: FarmLocation;
    totalArea: number;
    arableArea: number;
    soilType: SoilType;
    irrigationSystem: IrrigationSystem;
    certifications?: string[];
    isActive?: boolean;
  }): Farm {
    return new Farm(
      props.id,
      props.farmerId,
      props.name,
      props.location,
      props.totalArea,
      props.arableArea,
      props.soilType,
      props.irrigationSystem,
      props.certifications || [],
      props.isActive ?? true,
      new Date(),
      new Date(),
    );
  }

  updateFarm(updates: Partial<{
    name: string;
    location: FarmLocation;
    totalArea: number;
    arableArea: number;
    soilType: SoilType;
    irrigationSystem: IrrigationSystem;
    certifications: string[];
  }>): Farm {
    return new Farm(
      this.id,
      this.farmerId,
      updates.name ?? this.name,
      updates.location ?? this.location,
      updates.totalArea ?? this.totalArea,
      updates.arableArea ?? this.arableArea,
      updates.soilType ?? this.soilType,
      updates.irrigationSystem ?? this.irrigationSystem,
      updates.certifications ?? this.certifications,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }
}

export class FarmLocation {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
  ) {}
}

export enum SoilType {
  ARGILOSO = 'argiloso',
  ARENOSO = 'arenoso',
  MISTO = 'misto',
  CALCARIO = 'calcario',
  HUMIFERO = 'humifero',
}

export enum IrrigationSystem {
  PIVO_CENTRAL = 'pivo_central',
  GOTEJAMENTO = 'gotejamento',
  ASPERSAO = 'aspersao',
  SULCOS = 'sulcos',
  MANUAL = 'manual',
  NENHUM = 'nenhum',
}
