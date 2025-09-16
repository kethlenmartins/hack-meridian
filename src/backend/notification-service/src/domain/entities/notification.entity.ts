export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export enum NotificationType {
  EMAIL = 'email',
}

export class Notification {
  constructor(
    public readonly id: string,
    public readonly recipientEmail: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly type: NotificationType,
    public readonly status: NotificationStatus,
    public readonly createdAt: Date,
    public readonly sentAt?: Date,
    public readonly errorMessage?: string,
  ) {}

  static create(
    recipientEmail: string,
    subject: string,
    content: string,
    type: NotificationType = NotificationType.EMAIL,
  ): Notification {
    return new Notification(
      crypto.randomUUID(),
      recipientEmail,
      subject,
      content,
      type,
      NotificationStatus.PENDING,
      new Date(),
    );
  }

  markAsSent(): Notification {
    return new Notification(
      this.id,
      this.recipientEmail,
      this.subject,
      this.content,
      this.type,
      NotificationStatus.SENT,
      this.createdAt,
      new Date(),
      this.errorMessage,
    );
  }

  markAsFailed(errorMessage: string): Notification {
    return new Notification(
      this.id,
      this.recipientEmail,
      this.subject,
      this.content,
      this.type,
      NotificationStatus.FAILED,
      this.createdAt,
      this.sentAt,
      errorMessage,
    );
  }
}
