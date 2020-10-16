import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Workspace,
  User,
} from '../models';
import {WorkspaceRepository} from '../repositories';

export class WorkspaceUserController {
  constructor(
    @repository(WorkspaceRepository)
    public workspaceRepository: WorkspaceRepository,
  ) { }

  @get('/workspaces/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Workspace',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Workspace.prototype.id,
  ): Promise<User> {
    return this.workspaceRepository.user(id);
  }
}
