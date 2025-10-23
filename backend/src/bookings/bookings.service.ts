import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from './entities/booking-item.entity';
import { Seat } from './entities/seat.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class BookingsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(BookingItem) private bookingItemRepo: Repository<BookingItem>,
    @InjectRepository(Seat) private seatRepo: Repository<Seat>,
    @InjectRepository(Schedule) private scheduleRepo: Repository<Schedule>,
  ) {}

  /**
   * Create booking with transaction and pessimistic lock to avoid double booking.
   */
  async create(createDto: CreateBookingDto) {
    const { userId, scheduleId, seatIds } = createDto;
    if (!seatIds || seatIds.length === 0) {
      throw new BadRequestException('No seats selected');
    }

  return await this.dataSource.transaction(async (manager: EntityManager) => {
      // 1) Ensure schedule exists
      const schedule = await manager.findOne(Schedule, { where: { id: scheduleId } });
      if (!schedule) throw new BadRequestException('Schedule not found');

      // 2) Load seats with FOR UPDATE (pessimistic)
      // typeorm .find can pass lock only inside transaction via manager
      const seats = await manager.createQueryBuilder(Seat, 'seat')
        .setLock('pessimistic_write')
        .where('seat.id IN (:...ids)', { ids: seatIds })
        .andWhere('seat.scheduleId = :scheduleId', { scheduleId })
        .getMany();

      if (seats.length !== seatIds.length) {
        throw new BadRequestException('Some seats not found for this schedule');
      }

      // 3) Check availability and possibly reservedUntil
      const now = new Date();
      for (const s of seats) {
        if (s.status === 'booked') {
          throw new BadRequestException(`Seat ${s.seatLabel} already booked`);
        }
        if (s.status === 'reserved' && s.reservedUntil && s.reservedUntil > now) {
          throw new BadRequestException(`Seat ${s.seatLabel} currently reserved`);
        }
      }

      // 4) Mark seats as booked
      for (const s of seats) {
        s.status = 'booked';
        s.reservedUntil = null;
        await manager.save(Seat, s);
      }

      // 5) Create booking
      const booking = manager.create(Booking, {
        userId,
        scheduleId,
        status: 'confirmed', // since we assume immediate payment for demo
        totalAmount: seats.reduce((sum: number, x: Seat) => sum + Number(x.price), 0)
      });
      await manager.save(booking);

      // 6) Create booking items
      const items: BookingItem[] = [];
      for (const s of seats) {
        const bi = manager.create(BookingItem, {
          bookingId: booking.id,
          seatId: s.id,
          seatLabel: s.seatLabel,
          price: s.price
        });
        items.push(bi);
      }
      await manager.save(items);

      // 7) Return booking with items
      booking.items = items;
      return booking;
  }).catch((err: unknown) => {
      // handle expected and unexpected errors
      if (err instanceof BadRequestException) throw err;
      const msg = err && typeof err === 'object' && 'message' in err ? (err as any).message : String(err);
      throw new InternalServerErrorException(msg || 'Failed to create booking');
    });
  }

  async findOne(id: string) {
    return this.bookingRepo.findOne({ where: { id }, relations: ['items'] });
  }
}
