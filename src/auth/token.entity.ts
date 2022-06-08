import Version from '../helper/entity/version.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/User.entity';
import { TokenType } from '../helper/enum/tokenType.enum';


@Entity()
export default class Token extends BaseEntity{
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => User,(user) => {user.id})
  user: User;

  @Column() token: string;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @Column() expires: Date;

  @Column(() => Version)
  version: Version;
}
