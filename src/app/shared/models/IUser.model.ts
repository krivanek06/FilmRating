export interface IUserPartialData {
  uid: string;
  displayName: string;
}

export interface IUser extends IUserPartialData{
  email: string;
  photoUrl: string;
  points: number;
  notifications: IUserNotification[];
  usersFollowMe: IUserPartialData[];
  usersFollowI: IUserPartialData[];
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
  movieId?: string;
}

export enum IUserNotificationType {
  informative = 'informative',
  notification = 'notification'
}
