import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const privateKey = process.env.JWT_SECRET;

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: privateKey,
    });
  }

  validate(payload: any) {
    console.log('JwtStategy ', payload);
    return payload;
  }
}
