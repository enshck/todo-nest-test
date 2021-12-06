import { IUserModel } from './auth';
export interface ITodoModel {
  id?: string;
  idOfUser: string;
  value: string;
  scheduleAt: string;
  User?: IUserModel;
}

export interface IGetListResult {
  data: ITodoModel[];
}
