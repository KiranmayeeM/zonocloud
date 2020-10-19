import {HttpErrors} from '@loopback/rest';
import IsEmail from 'isemail';
import {Email, MObile} from '../repositories/user.repository';

export function validateEmail(validEmail:Email){
  console.log(validEmail.email)
  if(!IsEmail.validate(validEmail.email)){
    throw new HttpErrors.UnprocessableEntity('Invalid Email');
  }
}

export function validateMobile(validMobile:MObile){
  console.log(validMobile.mobile)
  if(validMobile.mobile.length < 0){
    throw new HttpErrors.UnprocessableEntity('Please Enter the correct mobile Number');
  }

}
