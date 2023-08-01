import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './modules/test.module';
import { JwtModule } from '@nestjs/jwt';
// import { TokenModule } from './modules/token.module';
import { AuthModule } from './modules/auth.module';
import { ExpenseRecordModule } from './modules/expenseRecord.module';
import { VerifyTokenMiddleware } from './common/middlewares/verifyToken.middleware';
import { TokenModule } from './modules/token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    TestModule,
    // TokenModule,
    AuthModule,
    ExpenseRecordModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes('expense-record');
  }
}
