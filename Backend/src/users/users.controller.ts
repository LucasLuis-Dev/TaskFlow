import { Controller, Get, UseGuards, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  @Roles(Role.ADMIN)
  @Patch(':id/role')
  @ApiBody({ schema: { type: 'object', properties: { role: { type: 'string', enum: ['ADMIN', 'USER'] } } } })
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    const user = await this.usersService.updateRole(id, role);
    const { password, ...result } = user;
    return result;
  }
}
