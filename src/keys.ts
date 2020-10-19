import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models/user.model';
import {Mobile} from './repositories/user.repository';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'z0n0d#1$c1!sz';
};

export namespace TokenServiceBindings{
    export const TOKEN_SECRET = BindingKey.create<string>(
      'authentication.jwt.secret'
    );
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
      'services.jwt.service'
    );
}

export namespace UserServiceBindings{
  export const USER_SERVICE = BindingKey.create<UserService<Mobile, User>>(
    'services.user.service'
  );
}
