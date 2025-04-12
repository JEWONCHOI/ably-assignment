import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SignupResponse } from './dto/signup.dto';
import { SigninDto, SigninResponse } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponse> {
    return await this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<SigninResponse> {
    return await this.authService.signin(signinDto);
  }
}
