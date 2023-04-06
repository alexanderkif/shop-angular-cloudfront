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
        error: (error: unknown) => {
          const url = new URL(request.url);
          const response = error as HttpErrorResponse;
          let errorMessage = `Request to "${url.pathname}" failed. Check the console for the details`;

          if ([401, 403].includes(response.status)) {
            errorMessage = `Error: ${response.status} - ${response.error.message}. Request to "${url.pathname}" failed.`;
          }

          this.notificationService.showError(errorMessage, 0);
        },
      })
    );
  }
}
