import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string; // URL renvoyée par le service de stockage objet

  @IsOptional()
  @IsString()
  sportId?: string;
}
