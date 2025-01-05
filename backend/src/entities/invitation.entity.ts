import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, event => event.invitations)
  event: Event;

  @Column()
  email: string;

  @Column()
  accessCode: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  })
  status: 'pending' | 'accepted' | 'declined';

  @CreateDateColumn()
  createdAt: Date;
}
