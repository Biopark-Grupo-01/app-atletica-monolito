import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FirebaseAuthGuard
  extends AuthGuard('firebase')
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> {
    return super.canActivate(context);
  }
}
