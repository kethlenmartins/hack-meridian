export class Investment {
  constructor(
    public readonly id: string,
    public readonly investorId: string,
    public readonly farmId: string,
    public readonly amount: number,
    public readonly expectedReturn: number,
    public readonly expectedDuration: number, // in months
    public readonly status: InvestmentStatus,
    public readonly startDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly endDate?: Date,
    public readonly actualReturn?: number,
    public readonly notes?: string,
  ) {}

  static create(props: {
    id: string;
    investorId: string;
    farmId: string;
    amount: number;
    expectedReturn: number;
    expectedDuration: number;
    notes?: string;
  }): Investment {
    return new Investment(
      props.id,
      props.investorId,
      props.farmId,
      props.amount,
      props.expectedReturn,
      props.expectedDuration,
      InvestmentStatus.PENDING,
      new Date(),
      new Date(),
      new Date(),
      undefined,
      undefined,
      props.notes,
    );
  }

  approve(): Investment {
    return new Investment(
      this.id,
      this.investorId,
      this.farmId,
      this.amount,
      this.expectedReturn,
      this.expectedDuration,
      InvestmentStatus.ACTIVE,
      this.startDate,
      this.createdAt,
      new Date(),
      this.endDate,
      this.actualReturn,
      this.notes,
    );
  }

  complete(actualReturn: number): Investment {
    return new Investment(
      this.id,
      this.investorId,
      this.farmId,
      this.amount,
      this.expectedReturn,
      this.expectedDuration,
      InvestmentStatus.COMPLETED,
      this.startDate,
      this.createdAt,
      new Date(),
      new Date(),
      actualReturn,
      this.notes,
    );
  }

  cancel(): Investment {
    return new Investment(
      this.id,
      this.investorId,
      this.farmId,
      this.amount,
      this.expectedReturn,
      this.expectedDuration,
      InvestmentStatus.CANCELLED,
      this.startDate,
      this.createdAt,
      new Date(),
      this.endDate,
      this.actualReturn,
      this.notes,
    );
  }
}

export enum InvestmentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
