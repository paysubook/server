import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './modules/test.module';
import { JwtModule } from '@nestjs/jwt';
// import { TokenModule } from './modules/token.module';
import { AuthModule } from './modules/auth.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
