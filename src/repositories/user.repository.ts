import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Workspace} from '../models';
import {WorkspaceRepository} from './workspace.repository';

export type Email = {
  email: string;
}

export type MObile = {
  mobile: string
}

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly workspaces: HasManyRepositoryFactory<Workspace, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('WorkspaceRepository') protected workspaceRepositoryGetter: Getter<WorkspaceRepository>,
  ) {
    super(User, dataSource);
    this.workspaces = this.createHasManyRepositoryFactoryFor('workspaces', workspaceRepositoryGetter,);
    this.registerInclusionResolver('workspaces', this.workspaces.inclusionResolver);
  }
}
