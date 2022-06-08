import { UserRole } from '../helper/enum/userRole.enum';
import Version from '../helper/entity/version.entity';
import { BaseEntity, Column, Entity, JoinColumn,  OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {Media} from '../media/Media.entiy';


@Entity()
export default class User extends BaseEntity{
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true }) email: string;

  @Column({ unique: true }) name: string;

  @Column({ type: 'boolean', default: false }) isDeleted: boolean;

  @Column() password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column(() => Version)
  version: Version;
  @Column({ default: false })
  isVerified: boolean;
  @Column({default:'0'})
  emailToken: string;
  
}
