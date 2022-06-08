import Joi from 'joi';

export class CartValid{
  static update = {
    body: Joi.object().keys({
      product: Joi.number().required(),
      quantity:Joi.number().required()
    }),
  };
}
