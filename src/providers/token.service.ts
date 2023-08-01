import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(email: string): string {
    const payload = { email, type: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '5m' });
  }

  generateRefreshToken(email: string): string {
    const payload = { email, type: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  async refreshToken(email: string) {
    try {
      const accessToken = this.generateAccessToken(email);

      return { statusCode: 200, data: { accessToken } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '가입되지 않은 회원입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
