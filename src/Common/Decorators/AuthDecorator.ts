import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { TokenTypeEnum } from '../Enums/TokenEnum.js';
import { AuthGuard } from '../Guards/AuthenticationGuard.js';
import { AuthorizationGuard } from '../Guards/AuthorizationGuard.js';
import { UserRoleEnum } from '../Enums/UserEnum.js';

export function AuthDoc({
  TokenType = TokenTypeEnum.AccessToken,
  UserRole = [UserRoleEnum.User, UserRoleEnum.Admin],
}: {
  TokenType?: TokenTypeEnum;
  UserRole?: UserRoleEnum[];
}) {
  return applyDecorators(
    SetMetadata('tokenType', TokenType),
    SetMetadata('Roles', UserRole),
    UseGuards(AuthGuard, AuthorizationGuard),
  );
}
