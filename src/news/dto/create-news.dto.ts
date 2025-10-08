import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  text: string;

  @IsInt()
  @IsNotEmpty()
  type_id: number;
}
