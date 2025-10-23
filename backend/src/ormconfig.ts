import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASS || 'apppassword',
  database: process.env.DB_NAME || 'bookingdb',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // FALSE in production; we will use migrations
  logging: false
});
