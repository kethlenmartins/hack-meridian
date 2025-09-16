export class Farmer {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly cpf: string,
    public readonly phone: string,
    public readonly address: FarmerAddress,
    public readonly farmExperience: number,
    public readonly certifications: string[],
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: string;
    email: string;
    fullName: string;
    cpf: string;
    phone: string;
    address: FarmerAddress;
    farmExperience: number;
    certifications?: string[];
    isActive?: boolean;
  }): Farmer {
    return new Farmer(
      props.id,
      props.email,
      props.fullName,
      props.cpf,
      props.phone,
      props.address,
      props.farmExperience,
      props.certifications || [],
      props.isActive ?? true,
      new Date(),
      new Date(),
    );
  }

  updateProfile(updates: Partial<{
    fullName: string;
    phone: string;
    address: FarmerAddress;
    farmExperience: number;
    certifications: string[];
  }>): Farmer {
    return new Farmer(
      this.id,
      this.email,
      updates.fullName ?? this.fullName,
      this.cpf,
      updates.phone ?? this.phone,
      updates.address ?? this.address,
      updates.farmExperience ?? this.farmExperience,
      updates.certifications ?? this.certifications,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }
}

export class FarmerAddress {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly neighborhood: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
    public readonly country: string = 'Brasil',
    public readonly complement?: string,
  ) {}
}
