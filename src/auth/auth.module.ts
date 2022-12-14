import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), JwtModule.register({
    secret: 'topSecret51',
    signOptions: {
      expiresIn: 3600,
    }
  }), PassportModule.register({ defaultStrategy: "jwt" })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
