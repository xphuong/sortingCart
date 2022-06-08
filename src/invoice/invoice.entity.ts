import Version from '../helper/entity/version.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/User.entity';
import CartItem from '../cart/CartItem.entity';


@Entity()
export default class Invoice extends BaseEntity{
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User,(user) => {user.id})
  user: User;

  @OneToMany(()=> CartItem, (items)=> {items.id})
  items: CartItem[]

  @Column()
  total_price: number;

  @Column(() => Version)
  version: Version;
}
