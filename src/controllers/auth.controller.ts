import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/providers/auth.service';
import { TokenService } from 'src/providers/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  setCookieJwtToken(res: Response, id: string) {
    const accessToken = this.tokenService.generateAccessToken(id);
    const refreshToken = this.tokenService.generateRefreshToken(id);

    res.cookie('access_token', accessToken, {
      maxAge: 1000 * 60 * 5,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refresh_token', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  @Post('login')
  async login(
    @Res() res,
    @Body('id') id: string,
    @Body('password') password: string,
  ) {
    const result = await this.authService.login(id, password);

    if (result.statusCode === 200) {
      this.setCookieJwtToken(res, id);
    }

    return res.status(result.statusCode).json(result.data);
  }

  @Post('signup')
  async signup(@Res() res: Response, @Body() signupBody) {
    const result = await this.authService.signup(signupBody);

    if (result.statusCode === 200) {
      this.setCookieJwtToken(res, signupBody.id);
    }

    return res.status(result.statusCode).json(result.data);
  }
}
