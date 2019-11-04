import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        const currentUser = this.userService.currentUser;
        const token = localStorage.getItem('token');
        request = request.clone({
            setHeaders: {
                 Authorization: `Bearer ${token}`,
            },
        });

        return next.handle(request);
    }
}