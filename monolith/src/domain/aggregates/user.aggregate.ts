import { User } from '../entities/user.entity';
import { TrainingUser } from '../entities/training-user.entity';
import { Training } from '../entities/training.entity';
import { AggregateRoot } from './aggregate-root';

export class UserAggregate extends AggregateRoot {
  private _user: User;
  private _trainingSubscriptions: TrainingUser[] = [];

  constructor(user: User, trainingSubscriptions: TrainingUser[] = []) {
    super();
    this._user = user;
    this._trainingSubscriptions = trainingSubscriptions;
  }

  get user(): User {
    return this._user;
  }

  get trainingSubscriptions(): TrainingUser[] {
    return [...this._trainingSubscriptions];
  }

  get id(): string {
    return this._user.id;
  }

  subscribeToTraining(training: Training): void {
    // Check if already subscribed
    const existingSubscription = this._trainingSubscriptions.find(
      (sub) => sub.training.id === training.id,
    );

    if (existingSubscription) {
      throw new Error('User is already subscribed to this training');
    }

    // Check if user has an active plan
    if (!this._user.isPlanActive()) {
      throw new Error('User must have an active plan to subscribe to training');
    }

    // Check for schedule conflicts
    const hasConflict = this._trainingSubscriptions.some((sub) => {
      return this.hasScheduleConflict(sub.training, training);
    });

    if (hasConflict) {
      throw new Error('Training schedule conflicts with existing subscription');
    }

    const trainingUser = new TrainingUser();
    trainingUser.user = this._user;
    trainingUser.training = training;

    this._trainingSubscriptions.push(trainingUser);
  }

  unsubscribeFromTraining(trainingId: string): void {
    const subscriptionIndex = this._trainingSubscriptions.findIndex(
      (sub) => sub.training.id === trainingId,
    );

    if (subscriptionIndex === -1) {
      throw new Error('User is not subscribed to this training');
    }

    this._trainingSubscriptions.splice(subscriptionIndex, 1);
  }

  getActiveTrainingSubscriptions(): TrainingUser[] {
    return this._trainingSubscriptions.filter((sub) => {
      // Assuming a training is active if it's in the future or today
      const trainingDate = new Date(sub.training.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return trainingDate >= today;
    });
  }

  getTrainingSubscriptionsByModality(modalityId: string): TrainingUser[] {
    return this._trainingSubscriptions.filter(
      (sub) => sub.training.trainingModalityId === modalityId,
    );
  }

  canSubscribeToTraining(training: Training): {
    canSubscribe: boolean;
    reason?: string;
  } {
    if (!this._user.isPlanActive()) {
      return {
        canSubscribe: false,
        reason: 'User must have an active plan to subscribe to training',
      };
    }

    const existingSubscription = this._trainingSubscriptions.find(
      (sub) => sub.training.id === training.id,
    );

    if (existingSubscription) {
      return {
        canSubscribe: false,
        reason: 'User is already subscribed to this training',
      };
    }

    const hasConflict = this._trainingSubscriptions.some((sub) => {
      return this.hasScheduleConflict(sub.training, training);
    });

    if (hasConflict) {
      return {
        canSubscribe: false,
        reason: 'Training schedule conflicts with existing subscription',
      };
    }

    return { canSubscribe: true };
  }

  private hasScheduleConflict(
    training1: Training,
    training2: Training,
  ): boolean {
    // Simple conflict check based on date and time
    if (training1.start_date !== training2.start_date) {
      return false;
    }

    // Parse time strings (assuming format HH:MM)
    const time1 = this.parseTime(training1.start_time);
    const time2 = this.parseTime(training2.start_time);

    // Assume 2-hour duration for simplicity
    const duration = 2 * 60; // 2 hours in minutes

    const end1 = time1 + duration;
    const end2 = time2 + duration;

    // Check for overlap
    return !(end1 <= time2 || end2 <= time1);
  }

  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  updateUserProfile(
    name?: string,
    phone?: string,
    profilePicture?: string,
  ): void {
    this._user.updateProfile(name, phone, profilePicture);
  }

  assignRole(roleId: string): void {
    this._user.assignRole(roleId);
  }

  updatePlan(startDate: Date, endDate: Date): void {
    this._user.updatePlan(startDate, endDate);
  }

  // Factory method to create a new UserAggregate
  static create(
    name: string,
    email: string,
    roleId?: string,
    cpf?: string,
    phone?: string,
  ): UserAggregate {
    const user = User.create(name, email, roleId, cpf, phone);
    return new UserAggregate(user);
  }

  // Factory method to reconstruct from persistence
  static fromPersistence(
    user: User,
    trainingSubscriptions: TrainingUser[] = [],
  ): UserAggregate {
    return new UserAggregate(user, trainingSubscriptions);
  }
}
