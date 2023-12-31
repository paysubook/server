import { Controller, Post, Res } from '@nestjs/common';
import { TokenService } from 'src/providers/token.service';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('refresh-token')
  async refreshToken(@Res() res) {
    const userId = res.locals.userId;
    const result = await this.tokenService.refreshToken(userId);

    return res.status(result.statusCode).json(result.data);
  }
}
