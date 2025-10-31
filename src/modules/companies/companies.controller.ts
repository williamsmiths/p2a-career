import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto, UpdateCompanyDto } from './dto'
import { CurrentUser, Public, Roles, UserRole } from '@common'

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  create(@CurrentUser('id') userId: string, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(userId, createCompanyDto)
  }

  @Get('me')
  @Roles(UserRole.COMPANY, UserRole.ALUMNI, UserRole.STARTUP)
  getMyCompany(@CurrentUser('id') userId: string) {
    return this.companiesService.getMyCompany(userId)
  }

  @Get()
  @Public()
  findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.companiesService.findAll(page, limit)
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: string) {
    return this.companiesService.findById(id)
  }

  @Put(':id')
  update(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: string,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return this.companiesService.update(userId, userRole, id, updateCompanyDto)
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: string, @CurrentUser('role') userRole: string, @Param('id') id: string) {
    return this.companiesService.delete(userId, userRole, id)
  }
}
