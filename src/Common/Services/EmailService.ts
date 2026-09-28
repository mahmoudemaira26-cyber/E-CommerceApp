import { BadRequestException, flatten, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attachment, createTransport } from 'nodemailer';
import { RedisService } from './RedisService.js';
import { EmailTypeEnum } from '../Enums/EmailEnum.js';
import { SecuityService } from './SecutityServices/HashBecrypt.js';

@Injectable()
export class EmailService {
  private MAIL_USER: string;
  private MAIL_PASS: string;
  constructor(
    private _configService: ConfigService,
    private _redisService: RedisService,
    private _securityService: SecuityService,
  ) {
    this.MAIL_USER = this._configService.get<string>('MAIL_USER');
    this.MAIL_PASS = this._configService.get<string>('MAIL_PASS');
  }
  async sendMail({
    to,
    attachments,
    html,
    subject,
    text,
  }: {
    to: string | string[];
    attachments?: Attachment[];
    html: string;
    subject: string;
    text?: string;
  }) {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.MAIL_USER,
        pass: this.MAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const Info = await transporter.sendMail({
      from: `Hello From ${this.MAIL_USER}`,
      to,
      attachments,
      html,
      subject,
      text,
    });
    console.log('Message sent:', Info.messageId);
  }
  async sendMailOTP({
    Email,
    EmailType,
    subject,
    text,
  }: {
    Email: string;
    EmailType: EmailTypeEnum;
    subject: string;
    text: string;
  }) {
    const PreviousOTP = await this._redisService.TTL(
      this._redisService.OTP_KEY({ Email, EmailType }),
    );
    if (PreviousOTP > 0) {
      throw new BadRequestException(
        `you Have Valid OTP Expire In${PreviousOTP}`,
      );
    }

    const BlockOTP = await this._redisService.TTL(
      this._redisService.OTP_KEY_BLOCK({ Email, EmailType }),
    );
    if (BlockOTP > 0) {
      throw new BadRequestException(
        `You can.t Request five OTP in ten Min Wait${BlockOTP}`,
      );
    }
    const OTPNums = await this._redisService.Getting(
      this._redisService.OTP_KEY_NUM({ Email, EmailType }),
    );

    if (OTPNums == 5) {
      await this._redisService.Setting({
        key: this._redisService.OTP_KEY_BLOCK({ Email, EmailType }),
        value: 1,
        EXvalue: 5 * 60,
      });
      throw new BadRequestException('You Have Been Blocked .. Waith 20 Min');
    }

    const OTP = Math.ceil(Math.random() * 900000 + 100000);

    this.sendMail({
      to: Email,
      html: `<h1>${OTP}</h1>`,
      subject,
      text,
    });
    await this._redisService.Setting({
      key: this._redisService.OTP_KEY({ Email, EmailType }),
      value: await this._securityService.Hashing({ PlainText: OTP.toString() }),
      EXvalue: 2 * 60,
    });

    await this._redisService.Incr(
      this._redisService.OTP_KEY_NUM({ Email, EmailType }),
    );
  }
}
