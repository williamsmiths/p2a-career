import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CvsService } from './cvs.service';
import { CreateCvDto, UpdateCvDto } from './dto';
import { CurrentUser, Roles, UserRole } from '@common';

/**
 * CVs Controller
 * Quản lý CV
 */
@ApiTags('cvs')
@ApiBearerAuth()
@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post()
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Tạo CV mới' })
  create(@CurrentUser('id') userId: string, @Body() createCvDto: CreateCvDto) {
    return this.cvsService.create(userId, createCvDto);
  }

  @Get('me')
  @Roles(UserRole.STUDENT, UserRole.ALUMNI)
  @ApiOperation({ summary: 'Lấy danh sách CV của tôi' })
  getMyCvs(@CurrentUser('id') userId: string) {
    return this.cvsService.getMyCvs(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết CV' })
  findById(@Param('id') id: string) {
    return this.cvsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật CV' })
  update(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
  ) {
    return this.cvsService.update(userId, userRole, id, updateCvDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa CV' })
  delete(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
  ) {
    return this.cvsService.delete(userId, userRole, id);
  }
}

