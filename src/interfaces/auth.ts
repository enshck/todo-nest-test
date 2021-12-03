export interface IAuthResult {
  userName: string;
  token: string;
}

export interface IUserModel {
  id?: number;
  userName: string;
  password: string;
}

export interface ITokenModel {
  id?: number;
  idOfUser: number;
  device: string;
  token: string;
  User?: IUserModel;
}
