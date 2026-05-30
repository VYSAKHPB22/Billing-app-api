import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Message } from './common/decorators/message.decorator';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Message('Application is running')
  @ApiOperation({ summary: 'Application health check' })
  @ApiOkResponse({ description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }
}
