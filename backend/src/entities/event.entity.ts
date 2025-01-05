import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Photo } from './photo.entity';
import { Invitation } from './invitation.entity';
import { EventPrivacy } from '../modules/events/dto/create-event.dto';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: EventPrivacy,
    default: EventPrivacy.PRIVATE
  })
  privacy: EventPrivacy;

  @Column({ unique: true })
  accessCode: string;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @ManyToOne(() => User, user => user.events)
  host: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', default: {
    transitionEffect: 'fade',
    displayTime: 5000,
    shuffle: false,
    loop: true
  }})
  slideshowSettings: {
    transitionEffect: string;
    displayTime: number;
    shuffle: boolean;
    loop: boolean;
  };

  @OneToMany(() => Photo, photo => photo.event)
  photos: Photo[];

  @OneToMany(() => Invitation, invitation => invitation.event)
  invitations: Invitation[];
}
