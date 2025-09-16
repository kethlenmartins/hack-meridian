export class Investor {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly cpf: string,
    public readonly phone: string,
    public readonly address: InvestorAddress,
    public readonly riskProfile: RiskProfile,
    public readonly investmentExperience: number,
    public readonly annualIncome: number,
    public readonly netWorth: number,
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
    address: InvestorAddress;
    riskProfile: RiskProfile;
    investmentExperience: number;
    annualIncome: number;
    netWorth: number;
    isActive?: boolean;
  }): Investor {
    return new Investor(
      props.id,
      props.email,
      props.fullName,
      props.cpf,
      props.phone,
      props.address,
      props.riskProfile,
      props.investmentExperience,
      props.annualIncome,
      props.netWorth,
      props.isActive ?? true,
      new Date(),
      new Date(),
    );
  }

  updateProfile(updates: Partial<{
    fullName: string;
    phone: string;
    address: InvestorAddress;
    riskProfile: RiskProfile;
    investmentExperience: number;
    annualIncome: number;
    netWorth: number;
  }>): Investor {
    return new Investor(
      this.id,
      this.email,
      updates.fullName ?? this.fullName,
      this.cpf,
      updates.phone ?? this.phone,
      updates.address ?? this.address,
      updates.riskProfile ?? this.riskProfile,
      updates.investmentExperience ?? this.investmentExperience,
      updates.annualIncome ?? this.annualIncome,
      updates.netWorth ?? this.netWorth,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }

  canInvest(amount: number): boolean {
    return amount <= this.netWorth * 0.1; // Max 10% of net worth per investment
  }
}

export class InvestorAddress {
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

export enum RiskProfile {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
}
