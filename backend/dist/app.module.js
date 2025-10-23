"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bookings_module_1 = require("./bookings/bookings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
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
            bookings_module_1.BookingsModule
        ]
    })
], AppModule);
