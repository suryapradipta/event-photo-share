import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Photo } from './photo.entity';
import { Invitation } from './invitation.entity';

export type PrivacyLevel = 'public' | 'private' | 'invite-only';
export type SlideshowSettings = {
  transitionEffect: string;
  displayTime: number;
  shuffle: boolean;
  loop: boolean;
};

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
    enum: ['public', 'private', 'invite-only'],
    default: 'private'
  })
  privacyLevel: PrivacyLevel;

  @Column({ unique: true })
  accessCode: string;

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
  slideshowSettings: SlideshowSettings;

  @OneToMany(() => Photo, photo => photo.event)
  photos: Photo[];

  @OneToMany(() => Invitation, invitation => invitation.event)
  invitations: Invitation[];
}
