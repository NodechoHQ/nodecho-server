import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsBoolean()
  dataLossAlertEnabled: boolean;

  @IsInt()
  @Min(1)
  missedDataThreshold: number;

  @IsBoolean()
  additionalPingCheck: boolean;

  @IsBoolean()
  resourceUsageAlertEnabled: boolean;

  @IsInt()
  @Min(0)
  @Max(100)
  systemLoadThreshold: number;

  @IsInt()
  @Min(0)
  @Max(100)
  memoryUsageThreshold: number;

  @IsInt()
  @Min(0)
  @Max(100)
  diskUsageThreshold: number;
}
