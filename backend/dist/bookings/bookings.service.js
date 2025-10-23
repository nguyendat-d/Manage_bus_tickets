"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const booking_item_entity_1 = require("./entities/booking-item.entity");
const seat_entity_1 = require("./entities/seat.entity");
const schedule_entity_1 = require("./entities/schedule.entity");
let BookingsService = class BookingsService {
    constructor(dataSource, bookingRepo, bookingItemRepo, seatRepo, scheduleRepo) {
        this.dataSource = dataSource;
        this.bookingRepo = bookingRepo;
        this.bookingItemRepo = bookingItemRepo;
        this.seatRepo = seatRepo;
        this.scheduleRepo = scheduleRepo;
    }
    async create(createDto) {
        const { userId, scheduleId, seatIds } = createDto;
        if (!seatIds || seatIds.length === 0) {
            throw new common_1.BadRequestException('No seats selected');
        }
        return await this.dataSource.transaction(async (manager) => {
            const schedule = await manager.findOne(schedule_entity_1.Schedule, { where: { id: scheduleId } });
            if (!schedule)
                throw new common_1.BadRequestException('Schedule not found');
            const seats = await manager.createQueryBuilder(seat_entity_1.Seat, 'seat')
                .setLock('pessimistic_write')
                .where('seat.id IN (:...ids)', { ids: seatIds })
                .andWhere('seat.scheduleId = :scheduleId', { scheduleId })
                .getMany();
            if (seats.length !== seatIds.length) {
                throw new common_1.BadRequestException('Some seats not found for this schedule');
            }
            const now = new Date();
            for (const s of seats) {
                if (s.status === 'booked') {
                    throw new common_1.BadRequestException(`Seat ${s.seatLabel} already booked`);
                }
                if (s.status === 'reserved' && s.reservedUntil && s.reservedUntil > now) {
                    throw new common_1.BadRequestException(`Seat ${s.seatLabel} currently reserved`);
                }
            }
            for (const s of seats) {
                s.status = 'booked';
                s.reservedUntil = null;
                await manager.save(seat_entity_1.Seat, s);
            }
            const booking = manager.create(booking_entity_1.Booking, {
                userId,
                scheduleId,
                status: 'confirmed',
                totalAmount: seats.reduce((sum, x) => sum + Number(x.price), 0)
            });
            await manager.save(booking);
            const items = [];
            for (const s of seats) {
                const bi = manager.create(booking_item_entity_1.BookingItem, {
                    bookingId: booking.id,
                    seatId: s.id,
                    seatLabel: s.seatLabel,
                    price: s.price
                });
                items.push(bi);
            }
            await manager.save(items);
            booking.items = items;
            return booking;
        }).catch((err) => {
            if (err instanceof common_1.BadRequestException)
                throw err;
            const msg = err && typeof err === 'object' && 'message' in err ? err.message : String(err);
            throw new common_1.InternalServerErrorException(msg || 'Failed to create booking');
        });
    }
    async findOne(id) {
        return this.bookingRepo.findOne({ where: { id }, relations: ['items'] });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(booking_item_entity_1.BookingItem)),
    __param(3, (0, typeorm_1.InjectRepository)(seat_entity_1.Seat)),
    __param(4, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
