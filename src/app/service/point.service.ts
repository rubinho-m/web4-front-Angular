import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Point} from "../point";

@Injectable({
  providedIn: 'root'
})

export class PointService {

  private baseURL = "http://localhost:8080/api/v1/points"

  constructor(private httpClient: HttpClient) {
  }

  private getHeaders(): HttpHeaders {

    return new HttpHeaders().set("Content-Type", 'application/x-www-form-urlencoded').set("username", localStorage.getItem("username"));
  }


  private getData(x, y, R) {
    let data = new URLSearchParams({
      x: x,
      y: y,
      R: R
    })

    return data;
  }

  getPointsList(): Observable<Point[]> {
    return this.httpClient.get<Point[]>(this.baseURL, {headers: this.getHeaders()});
  }


  createPoint(point: Point): Observable<any> {

    return this.httpClient.post(this.baseURL, this.getData(point.x, point.y, point.r), {headers: this.getHeaders()})
  }

  deleteAllPoints(): Observable<any> {
    return this.httpClient.delete(this.baseURL, {headers: this.getHeaders()})
  }
}
