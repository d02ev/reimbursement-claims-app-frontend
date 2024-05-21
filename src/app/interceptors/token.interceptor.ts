import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { catchError, map, ObservableInput, switchMap, throwError } from 'rxjs';
import { RefreshAccessTokenResponseDto } from '../../dtos';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	let accessToken = authService.getAccessToken();
	let refreshToken = authService.getRefreshToken();
	const excludedUrls = ['/register', '/login'];
	const reqUrlContainsExcludedUrl = excludedUrls.some((url) => req.url.includes(url));
	let reqWithAuthHeader = req;

	if (accessToken && !reqUrlContainsExcludedUrl) {
		reqWithAuthHeader = addAuthHeader(req, accessToken);

		return next(reqWithAuthHeader).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					if (refreshToken) {
						return authService.refreshAccessToken(refreshToken).pipe(
							map((response: RefreshAccessTokenResponseDto): any => {
								window.localStorage.setItem('accessToken', response.accessToken);

								return next(addAuthHeader(req, response.accessToken));
							}),
						);
					}
				}
				return throwError(() => new Error(error.message));
			}),
		);
	}
	return next(req);
};

const addAuthHeader = (req: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> => {
	return req.clone({
		setHeaders: { Authorization: `Bearer ${accessToken}` },
	});
};
