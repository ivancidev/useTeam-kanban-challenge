import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { CardPriority, CardType } from '../entities/card.entity';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'El título es requerido' })
  @MaxLength(100, { message: 'El título no puede exceder 100 caracteres' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'La descripción no puede exceder 1000 caracteres',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, {
    message: 'Los comentarios no pueden exceder 2000 caracteres',
  })
  comments?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha límite debe ser una fecha válida' })
  dueDate?: string;

  @IsOptional()
  @IsEnum(CardPriority, { message: 'La prioridad debe ser válida' })
  priority?: CardPriority;

  @IsOptional()
  @IsEnum(CardType, { message: 'El tipo debe ser válido' })
  type?: CardType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsNotEmpty()
  columnId: string;
}
