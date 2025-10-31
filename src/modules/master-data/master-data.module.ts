import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterDataService } from './master-data.service';
import { MasterDataSeeder } from './master-data.seeder';
import { MasterDataController } from './master-data.controller';

// Entities
import { Industry, Skill, PositionLevel, ExperienceLevel, CompanySize } from '@entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Industry,
      Skill,
      PositionLevel,
      ExperienceLevel,
      CompanySize,
    ]),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService, MasterDataSeeder],
  exports: [MasterDataService],
})
export class MasterDataModule {}
