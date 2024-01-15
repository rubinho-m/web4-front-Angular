import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {User} from "../user";
import {catchError, Observable, throwError} from "rxjs";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    private baseURL = "http://localhost:8080/api/v1/";

    constructor(private httpClient: HttpClient) {
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders().set("Content-Type", 'application/x-www-form-urlencoded');
    }

    private getData(username, hashPassword) {
        let data = new URLSearchParams({
            username: username,
            hashPassword: hashPassword
        })

        return data;
    }


    authorize(user: User): Observable<any> {
        return this.httpClient.post(this.baseURL + "authorize", this.getData(user.login, user.hashPassword), {headers: this.getHeaders()})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Invalid username or password",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    return throwError(error);
                })
            )
    }

    register(user: User): Observable<any> {


        return this.httpClient.post(this.baseURL + "register", this.getData(user.login, user.hashPassword), {headers: this.getHeaders()})
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: "Username already exists",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    return throwError(error);
                })
            )
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    clearToken(): void {
        localStorage.removeItem('token');
    }

}
