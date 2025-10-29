import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { MasterDataController } from './master-data.controller';

// Entities
import { Country, City, District, Industry, Skill, PositionLevel, ExperienceLevel, CompanySize } from '@entities';

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
