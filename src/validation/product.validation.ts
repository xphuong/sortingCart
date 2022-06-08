import Joi from 'joi';

export default class ProductValidation{
  static createProduct = {
    body: Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().required(),
      review: Joi.string().required(),
      quantity:Joi.number().required(),
    }),
  };
  static getProducts ={
    query: Joi.object().keys({
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };
  static updateProduct = {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      review: Joi.string().optional(),
      quantity: Joi.number().optional(),
    }),
  };
  static deleteProduct = {
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  };
}

