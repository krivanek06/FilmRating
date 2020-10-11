export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl: string;
  points?: number;
  notifications: IUserNotification[];
  usersFollowMe: string[];
  usersFollowI: string[];
}

export interface LoginIUser {
  email: string;
  password: string;
}

export interface RegisterIUser {
  email: string;
  password1: string;
  password2: string;
}

export interface IUserNotification {
  message: string;
  read: boolean;
  timestamp: number;
  type: IUserNotificationType;
}

export enum IUserNotificationType {
  informative = 'informative',
  notification = 'notification'
}
