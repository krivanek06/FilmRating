export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
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
