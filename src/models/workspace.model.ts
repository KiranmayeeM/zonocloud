import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Workspace extends Entity {

  @property({
    type: 'string',
    id: true,
    mongodb: {
      dataType: 'ObjectID' // or perhaps 'objectid'?
    }
  })
  id?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @belongsTo(() => User)
  userId: string;

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
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Workspace>) {
    super(data);
  }
}

export interface WorkspaceRelations {
  // describe navigational properties here
}

export type WorkspaceWithRelations = Workspace & WorkspaceRelations;
