import { AuthGuard } from '@nestjs/passport';

export class PaulJwtGuard extends AuthGuard('paul-jwt') {
  constructor() {
    super();
  }
}
