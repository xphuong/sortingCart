import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartStatus } from '../helper/enum/cartStatus.enum';
import Invoice from '../invoice/invoice.entity';
import Product  from '../product/Product.entity';
import User from '../user/User.entity';
@Entity()
export default class CartItem extends BaseEntity{

  @PrimaryGeneratedColumn() id!: number;

  @ManyToOne(() => User,(user) => user.id)
  user: User;

  @ManyToOne(() => Product,(product) => product.id)
  product: Product

  @Column({ default: 1 })
  quantity: number  

  @Column({ default: 0.00 })
  total_price: number

  @ManyToOne(() => Invoice,(invoice) => invoice.id)
  invoice: Invoice

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.UNPAID,
  })
  status: CartStatus;
}