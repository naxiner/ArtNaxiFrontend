import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const authReq = authToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }, withCredentials: true
            });
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};


