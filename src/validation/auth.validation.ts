import Joi from 'joi';

export class AuthValid{
  static register = {
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email(),
      password:Joi.string().required()
    }),
  };
  static login = {
    body: Joi.object().keys({
      email: Joi.string().email(),
      password:Joi.string().required()
    }),
  };
  static tokenRefresh = {
    body: Joi.object().keys({
      refreshToken:Joi.string().required()
    }),
  };
}
