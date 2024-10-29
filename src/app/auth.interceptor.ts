import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { switchMap, catchError, of } from 'rxjs';

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
          // Запитуємо оновлення токену
          return authService.refreshToken().pipe(
            switchMap((newToken) => {
              // Якщо токен оновлено, повторно виконуємо запит із новим токеном
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(newAuthReq);
            }),
            // Якщо оновлення токену не вдалося, повертаємо оригінальну помилку
            catchError(() => of(error))
          );
        }
        // Якщо помилка не 401, повертаємо її без змін
        return of(error);
      })
    );

  return next(req);
};


