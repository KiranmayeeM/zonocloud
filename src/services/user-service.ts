import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models/user.model';
import {Mobile, UserRepository} from '../repositories';

export class MyUserService implements UserService<User, Mobile>{
  constructor(
    @repository(UserRepository)
  public userRepository: UserRepository,
  ) {}
  async verifyCredentials(credentials: Mobile): Promise<User> {

    const foundUser = await this.userRepository.findOne({
      where:{
        mobile:credentials.mobile
      }
    })
    if(!foundUser){
      throw new HttpErrors.NotFound(`User not found with this ${credentials.mobile}`);
    }
    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {
    // const foundUser = await this.findUserByMObile(credentials.mobile);
    return {
      [securityId]:`${user.id}`,
      name: user.firstName,
      id: user.id,
      mobile:user.mobile
    };
  }

  //function to find user by id
  async findUserByMObile(mobile: string): Promise<User>  {
    const userNotfound = 'invalid User';
    const foundUser = await this.userRepository.findOne({
      where: {mobile: mobile},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }

}
