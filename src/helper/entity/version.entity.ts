import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export default class Version {
  @CreateDateColumn() create_at: Date;
  @UpdateDateColumn() modified_at: Date;
  @VersionColumn() revision: number;
}
