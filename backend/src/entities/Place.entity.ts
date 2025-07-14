import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from './Photo.entity';
import { Review } from './Review.entity';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  category: string;

  @Column()
  short_description: string;

  @Column({ type: 'float' })
  x: number;

  @Column({ type: 'float' })
  y: number;

  @Column()
  full_description: string;

  @Column({ nullable: true })
  yandex_link?: string;

  @Column({ default: false })
  is_approved: boolean;

  @OneToMany(() => Photo, (photo) => photo.place)
  photos: Photo[];

  @OneToMany(() => Review, (review) => review.place)
  reviews: Review[];
}
