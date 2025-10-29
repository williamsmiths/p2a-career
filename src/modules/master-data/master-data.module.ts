import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';

// Entities
import { Country } from '../../database/entities/country.entity';
import { City } from '../../database/entities/city.entity';
import { District } from '../../database/entities/district.entity';
import { Industry } from '../../database/entities/industry.entity';
import { Skill } from '../../database/entities/skill.entity';
import { PositionLevel } from '../../database/entities/position-level.entity';
import { ExperienceLevel } from '../../database/entities/experience-level.entity';
import { CompanySize } from '../../database/entities/company-size.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Country,
      City,
      District,
      Industry,
      Skill,
      PositionLevel,
      ExperienceLevel,
      CompanySize,
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule {}
