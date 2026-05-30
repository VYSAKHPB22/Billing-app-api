import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Message } from '../common/decorators/message.decorator';
import {
  ApiPaginationQueries,
  ApiStandardErrors,
} from '../common/decorators/swagger.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAdminGuard } from '../auth/guards/jwt-admin.guard';
import { LogsService } from './logs.service';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAdminGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('activity')
  @Message('Activity logs fetched successfully')
  @ApiOperation({
    summary: 'List activity logs',
    description: 'Returns successful request logs. Admin only.',
  })
  @ApiPaginationQueries('Search by request path')
  @ApiOkResponse({ description: 'Activity logs fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findActivityLogs(@Query() query: PaginationQueryDto) {
    return this.logsService.findActivityLogs(query);
  }

  @Get('errors')
  @Message('Error logs fetched successfully')
  @ApiOperation({
    summary: 'List error logs',
    description: 'Returns failed request logs. Admin only.',
  })
  @ApiPaginationQueries('Search by request path')
  @ApiOkResponse({ description: 'Error logs fetched successfully' })
  @ApiStandardErrors({ auth: true, forbidden: true })
  findErrorLogs(@Query() query: PaginationQueryDto) {
    return this.logsService.findErrorLogs(query);
  }
}
