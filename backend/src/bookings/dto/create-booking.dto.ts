import { IsUUID, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  userId: string;

  @IsString()
  scheduleId: string;

  @IsArray()
  @ArrayNotEmpty()
  seatIds: string[]; // array of seat.id the user selects
}
