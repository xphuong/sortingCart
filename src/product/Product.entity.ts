import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Version from "../helper/entity/version.entity";
import "reflect-metadata"
import Media from "../media/Media.entiy";


@Entity()
export default class Product extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!:string

    @Column()
    price!: number

    @Column()
    review!: string

    @Column()
    quantity!: number

    @OneToMany(() => Media, (src: Media) => src.product, { eager: true })
    images: Media[];

    @Column(() => Version)
    version: Version;
  
   
  
}