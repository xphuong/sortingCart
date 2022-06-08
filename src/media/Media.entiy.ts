
import 'reflect-metadata';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Version from '../helper/entity/version.entity';
import Product from '../product/Product.entity';
@Entity()
export default class Media extends BaseEntity {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column()
  fileName:string

  @Column() 
  mimeType: string;

  @Column()
  fileSize:string

  @Column() 
  filePath: string;

  @ManyToOne(() => Product,(product:Product)=>product.images)
  product: Product;

  @Column(() => Version)
  version: Version;

}