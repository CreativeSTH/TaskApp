import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../services/toast.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        ToastService,
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => httpMock.verify());

  it('calls ToastService.show() on a 500 error', () => {
    const showSpy = vi.spyOn(toastService, 'show');
    http.get('/api/test').subscribe({ error: () => {} });
    httpMock.expectOne('/api/test').flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    expect(showSpy).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('calls ToastService.show() on a 404 error', () => {
    const showSpy = vi.spyOn(toastService, 'show');
    http.get('/api/missing').subscribe({ error: () => {} });
    httpMock.expectOne('/api/missing').flush('Not found', { status: 404, statusText: 'Not Found' });
    expect(showSpy).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('re-throws the error so the caller receives it', () => {
    let caughtError: unknown = null;
    http.get('/api/test').subscribe({ error: (e) => (caughtError = e) });
    httpMock.expectOne('/api/test').flush('Error', { status: 500, statusText: 'Server Error' });
    expect(caughtError).not.toBeNull();
  });

  it('does not call ToastService.show() on a successful request', () => {
    const showSpy = vi.spyOn(toastService, 'show');
    http.get('/api/ok').subscribe();
    httpMock.expectOne('/api/ok').flush({ data: 'ok' });
    expect(showSpy).not.toHaveBeenCalled();
  });
});
