import { IsNotEmpty } from 'class-validator';

export class GetCustomerDto {
  @IsNotEmpty({ message: 'Bạn chưa gửi số điện thoại.' })
  SDT: string;
}
