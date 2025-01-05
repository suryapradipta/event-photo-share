import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalFilename: string;

  @ManyToOne(() => User)
  uploadedBy: User;

  @ManyToOne(() => Event, event => event.photos)
  event: Event;

  @CreateDateColumn()
  uploadDate: Date;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  thumbnailUrl: string;

  @Column()
  optimizedUrl: string;

  @Column()
  originalUrl: string;
}
