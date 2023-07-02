import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './event/event.module';
import { ContractorModule } from './contractor/contractor.module';
import { BillingModule } from './billing/billing.module';
import { LessonModule } from './lesson/lesson.module';
import { CourseModule } from './course/course.module';
import { ClientModule } from './client/client.module';
import { ChatModule } from './chat/chat.module';
import { PremiseModule } from './premise/premise.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    EventModule,
    ContractorModule,
    BillingModule,
    LessonModule,
    CourseModule,
    ClientModule,
    ChatModule,
    PremiseModule,
    RoomModule,
  ],
})
export class AppModule {}
