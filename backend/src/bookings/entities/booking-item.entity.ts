import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('booking_items')
export class BookingItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Booking, (booking: Booking) => booking.items)
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column()
  bookingId!: string;

  @Column()
  seatId!: string;

  @Column({ length: 10 })
  seatLabel!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;
}
