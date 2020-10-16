import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Workspace, WorkspaceRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class WorkspaceRepository extends DefaultCrudRepository<
  Workspace,
  typeof Workspace.prototype.id,
  WorkspaceRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Workspace.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Workspace, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
