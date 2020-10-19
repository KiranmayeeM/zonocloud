import {Entity, hasMany, model, property} from '@loopback/repository';
import {Workspace} from './workspace.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  mobile: string;

  @property({
    type: 'string',
  })
  city: string;

  @property({
    type: 'string',
  })
  role: string;

  @property({
    type: 'string',
  })
  OTP: string;

  @property({
    type: 'object',
  })
  address: object;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  token: string;

  @property({
    type: "Date",
  })
  registeredOn: Date;

  @property({
    type: "Date",
  })
  createdAt: Date;

  @property({
    type: "Date",
  })
  updatedAt: Date;

  @property({
    type: 'string',
    id:true,
    mongodb: {
      dataType: 'ObjectID' // or perhaps 'objectid'?
    }
  })
  id?: string;


  @hasMany(() => Workspace)
  workspaces: Workspace[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
