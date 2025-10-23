import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { Seat } from './entities/seat.entity';
import { Schedule } from './entities/schedule.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookingItem, Seat, Schedule])],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
