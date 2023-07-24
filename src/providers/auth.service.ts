import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { GenderCode } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async encodingPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async isComparePassword(userPassword: string, inputPassword: string) {
    const isMatchPassword = await bcrypt.compare(inputPassword, userPassword);
    return isMatchPassword;
  }

  async login(id: string, password: string) {
    try {
      const userInfo = await this.userModel.findOne({ id });
      const isMatchPassword = await this.isComparePassword(
        userInfo.password,
        password,
      );

      if (!isMatchPassword) {
        return {
          statusCode: 412,
          data: {
            message: '아이디 또는 비밀번호가 잘못되었습니다.',
          },
        };
      }

      return { statusCode: 200, data: { isLogin: true } };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, data: { message: '서버요청 실패.' } };
    }
  }

  async signup({ name, birthday, genderCode, id, password }) {
    try {
      const userInfo = await this.userModel.findOne({ id });

      if (!!userInfo) {
        return {
          statusCode: 409,
          data: { message: '이미 가입되어 있는 계정입니다.' },
        };
      }

      const hashedPassword = await this.encodingPassword(password);
      const createProfile = new this.userModel({
        id,
        name,
        birthday,
        password: hashedPassword,
        genderCode: GenderCode[genderCode],
      });
      await createProfile.save();

      return { statusCode: 200, data: { isSignup: true } };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, data: { message: '서버요청 실패.' } };
    }
  }
}
