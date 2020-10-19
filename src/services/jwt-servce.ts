import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService{
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret:string
  async generateToken(user:UserProfile):Promise<string>{
    if(!user){
      throw new HttpErrors.Unauthorized('Error while generating token : user is null',
      );
    }
    let token = '';
    try {
      token = await signAsync({ user }, this.jwtSecret, {});
    } catch (error) {
      throw new HttpErrors.Unauthorized(`error generating token ${error}`);
    }
    return token;
  }
  async verifyToken(token: string):Promise<UserProfile>{
    if(!token){
      throw new HttpErrors.Unauthorized(`
      Error verifying token:'token' is null
      `)
    }

    let userProfile:UserProfile;
    try {
      //decode user profile from token
      const { user }= await verifyAsync(token, this.jwtSecret);
      console.log('decryptedToken', user);

      userProfile = Object.assign(
        {
          id:user.id,
          name:user.name,
          [securityId]:user.id
        }
      )
    } catch (error) {
      throw new HttpErrors.Unauthorized(`
      Error verifying token : ${error.message}
      `)
    }

    return userProfile;

  }
}
