import { ApiProperty } from '@nestjs/swagger';

export interface IMessageResponse {
  message: string;
}

export class MessageResponse {
  @ApiProperty()
  message: string;
}
