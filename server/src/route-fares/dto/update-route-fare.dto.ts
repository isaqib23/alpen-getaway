import { PartialType } from '@nestjs/swagger';
import { CreateRouteFareDto } from './create-route-fare.dto';

export class UpdateRouteFareDto extends PartialType(CreateRouteFareDto) {}