import { BaseDomainEvent } from './base-domain.event';

export class UserRegisteredEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly roleId?: string,
  ) {
    super('UserRegistered');
  }
}

export class UserRoleChangedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly previousRoleId: string | null,
    public readonly newRoleId: string,
  ) {
    super('UserRoleChanged');
  }
}

export class UserPlanUpdatedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly planStartDate: Date,
    public readonly planEndDate: Date,
  ) {
    super('UserPlanUpdated');
  }
}

export class UserProfileUpdatedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly updatedFields: Record<string, any>,
  ) {
    super('UserProfileUpdated');
  }
}
