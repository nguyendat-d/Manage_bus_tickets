import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'db',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER || 'appuser',
        password: process.env.DB_PASS || 'apppassword',
        database: process.env.DB_NAME || 'bookingdb',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    BookingsModule
  ]
})
export class AppModule {}
