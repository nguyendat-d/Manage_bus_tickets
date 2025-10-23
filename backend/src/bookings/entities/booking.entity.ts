import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { BookingItem } from './booking-item.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string; // reference to users table; keep simple

  @Column()
  scheduleId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: 'pending' | 'confirmed' | 'cancelled';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => BookingItem, (item: BookingItem) => item.booking, { cascade: true })
  items!: BookingItem[];
}
