import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (e: unknown) => {
          const url = new URL(request.url);
          const err = e as HttpErrorResponse;
          let message = `Request to "${url.pathname}" failed. Check the console for the details`;

          if (err.status === 401) {
            message = 'You are not authorized. Please login';
          }
          if (err.status === 403) {
            message = 'The access is denied';
          }

          this.notificationService.showError(message, 0);
        },
      })
    );
  }
}
