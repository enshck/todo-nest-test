export interface IAuthResult {
  email: string;
  token: string;
}

export interface IUserModel {
  id?: string;
  email: string;
  password: string;
}

export interface ITokenModel {
  id?: string;
  idOfUser: string;
  device: string;
  token: string;
  User?: IUserModel;
}
