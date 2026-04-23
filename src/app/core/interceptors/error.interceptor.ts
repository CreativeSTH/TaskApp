import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = resolveErrorMessage(error);
      toast.show(message, 'error');
      return throwError(() => error);
    })
  );
};

function resolveErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) return 'No se pudo conectar con el servidor.';
  if (error.status === 404) return 'Recurso no encontrado (404).';
  if (error.status === 500) return 'Error interno del servidor (500).';
  return `Error inesperado (${error.status}).`;
}
