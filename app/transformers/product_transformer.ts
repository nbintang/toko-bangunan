import { BaseTransformer } from '@adonisjs/core/transformers'
import Product from '#models/product'

export default class ProductTransformer extends BaseTransformer<Product> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}