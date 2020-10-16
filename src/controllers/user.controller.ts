import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef, HttpErrors, param,
  patch,
  post,
  put,
  requestBody
} from '@loopback/rest';
import * as _ from 'lodash';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {validateEmail, validateMobile} from '../services/validator';
const rn = require('random-number');
const gen = rn.generator({
  min: 1000,
  max: 9999,
  integer: true,
});


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/sendotp', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async sendOtp(@requestBody() userData:User): Promise<User> {
    const otp = gen();
    console.log('otp', otp);
    await this.userRepository.findOne({"where":{mobile:userData.mobile}}).then(async (user)=>{
      console.log('user', user);
      if(user && user!==undefined || user!==null){
        console.log('user', user);
        userData.OTP = otp;
        userData.updatedAt = new Date();
        await this.userRepository.updateById(user.id, userData);
      } else{
        console.log('else', user);
        userData.OTP = otp;
        userData.createdAt = new Date();
        await this.userRepository.create(userData);
      }
    }).catch((err)=> {throw new HttpErrors.UnprocessableEntity(err)});
    return userData;
  }

  @post('/verifyotp', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async verifyOtp(@requestBody() userData:User): Promise<string> {
    console.log('userData', userData);
    let message = "";
    await this.userRepository.findOne({"where":{mobile:userData.mobile}}).then(async (user)=>{
      console.log('user', user);
      if(user && user!==undefined || user!==null){
        console.log('user', user);
        if(user.OTP === userData.OTP){
          userData.registeredOn = new Date();
          message = "OTP verified Succesfully";
          await this.userRepository.updateById(user.id, userData);
        }
      }
    }).catch((err)=> {
      message = "Otpverification failed";
      throw new HttpErrors.UnprocessableEntity(err)
    });
    return message;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async signUp(@requestBody() userData:User){
    if(userData.email)
      validateEmail(_.pick(userData, ['email']));
    if(userData.mobile)
      validateMobile(_.pick(userData, ['mobile']));
    const savedUser = await this.userRepository.create(userData);
    return savedUser;
  }

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',

          }),
        },
      },
    },)
    user: User,
  ): Promise<User> {
    console.log(user);
    user.registeredOn = new Date();
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    // const userCollection = (this.userRepository.dataSource.connector as any).collection("User");
    // return userCollection
    //   .aggregate([
    //     {$limit: 3}
    //   ]).get();
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
