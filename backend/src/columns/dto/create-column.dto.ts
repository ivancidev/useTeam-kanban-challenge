import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  boardId: string;
}
