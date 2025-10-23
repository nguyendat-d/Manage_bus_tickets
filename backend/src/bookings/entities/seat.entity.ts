import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { Schedule } from './schedule.entity';

export type SeatStatus = 'available' | 'reserved' | 'booked';

@Entity('seats')
@Index(['scheduleId','seatLabel'], { unique: true })
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  scheduleId!: string;

  @ManyToOne(() => Schedule, (s: Schedule) => s.seats)
  schedule!: Schedule;

  @Column({ length: 10 })
  seatLabel!: string; // e.g., A1

  @Column({ type: 'enum', enum: ['available','reserved','booked'], default: 'available' })
  status!: SeatStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'timestamp', nullable: true })
  reservedUntil: Date | null;
}
