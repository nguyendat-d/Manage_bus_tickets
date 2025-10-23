import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seat } from './seat.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  routeName!: string; // origin-destination text for demo

  @Column({ type: 'datetime' })
  departureAt!: Date;

  @OneToMany(() => Seat, (seat: Seat) => seat.schedule)
  seats!: Seat[];
}
