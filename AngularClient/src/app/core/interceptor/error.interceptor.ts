import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toster: ToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          if (error.status === 400) {
            if (error.error.errors) {
              throw error.error;
            } else {
              this.toster.error(error.error.message, error.error.statusCode);
            }
          }
          if (error.status === 401) {
            this.toster.error(error.error.message, error.error.statusCode);
          }
          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }
          if (error.status === 500) {
            // pass extra information in the router, so that we can access this
            // error information in the server-error page and display it.
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
