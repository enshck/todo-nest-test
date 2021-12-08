import { ApiProperty } from '@nestjs/swagger';

export default class CreateElementDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty({
    type: 'string',
  })
  value: string;

  @ApiProperty({
    type: 'string',
  })
  scheduleAt: string;
}
