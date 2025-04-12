import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserInfoResponse } from './dto/user-info.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @Get('info')
  getUserInfo(@Req() req: Request): UserInfoResponse {
    return {
      id: req.user.id,
      email: req.user.email,
      nickname: req.user.nickname,
    };
  }
}
