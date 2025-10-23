import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { Cv, CvExperience, CvProject, CvCertification } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, CvExperience, CvProject, CvCertification])],
  controllers: [CvsController],
  providers: [CvsService],
  exports: [CvsService],
})
export class CvsModule {}

