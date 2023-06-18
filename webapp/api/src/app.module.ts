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
  ],
})
export class AppModule {}
