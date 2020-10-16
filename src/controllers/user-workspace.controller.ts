import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Workspace,
} from '../models';
import {UserRepository} from '../repositories';

export class UserWorkspaceController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/workspaces', {
    responses: {
      '200': {
        description: 'Array of User has many Workspace',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Workspace)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Workspace>,
  ): Promise<Workspace[]> {
    return this.userRepository.workspaces(id).find(filter);
  }

  @post('/users/{id}/workspaces', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Workspace)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workspace, {
            title: 'NewWorkspaceInUser',
            exclude: ['id'],
            optional: ['_id']
          }),
        },
      },
    }) workspace: Omit<Workspace, 'id'>,
  ): Promise<Workspace> {
    return this.userRepository.workspaces(id).create(workspace);
  }

  @patch('/users/{id}/workspaces', {
    responses: {
      '200': {
        description: 'User.Workspace PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workspace, {partial: true}),
        },
      },
    })
    workspace: Partial<Workspace>,
    @param.query.object('where', getWhereSchemaFor(Workspace)) where?: Where<Workspace>,
  ): Promise<Count> {
    return this.userRepository.workspaces(id).patch(workspace, where);
  }

  @del('/users/{id}/workspaces', {
    responses: {
      '200': {
        description: 'User.Workspace DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Workspace)) where?: Where<Workspace>,
  ): Promise<Count> {
    return this.userRepository.workspaces(id).delete(where);
  }
}
