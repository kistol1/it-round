import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from './Place.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  file_path: string;

  @ManyToOne(() => Place, (place) => place.photos, { onDelete: 'CASCADE' })
  place: string;
}
