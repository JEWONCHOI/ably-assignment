import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SaveUserDto } from './dto/save-user.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * email을 기준으로 유저를 조회합니다
   *
   * @param email 유저 email
   * @returns 유저 객체 혹은 null(일치하는 이메일이 없는 경우)
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   *
   * user를 생성합니다
   *
   * @param saveUserDto email, password, nickname
   * @returns 생성된 유저 객체
   */
  async saveUser(saveUserDto: SaveUserDto): Promise<User> {
    return await this.userRepository.save(saveUserDto);
  }
}
