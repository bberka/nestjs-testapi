import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Sends OK in release and redirects to swagger on debug',
  })
  home(@Request() req) {
    if (process.env.IS_DEBUG) {
      //redirect to swagger
      req.res.redirect('/swagger');
      return;
    }
    return 'OK!';
  }
}
