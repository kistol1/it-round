import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Place } from './Place.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  text: string;

  @Column({ type: 'int' })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  place: Place;
}
