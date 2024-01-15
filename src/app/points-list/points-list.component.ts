import {Component, OnInit} from '@angular/core';
import {Point} from "../point";
import {PointService} from "../service/point.service";

@Component({
    selector: 'app-points-list',
    templateUrl: './points-list.component.html',
    styleUrls: ['./points-list.component.css']
})
export class PointsListComponent implements OnInit {
    points: Point[] = [];

    constructor(private pointService: PointService) {
    }

    ngOnInit(): void {
        this.getPoints();
        setInterval(() => this.getPoints(), 500);
    }

    private getPoints() {
        this.pointService.getPointsList().subscribe(data => {
            this.points = data
        });
    }

    public onClear(): void {
        this.pointService.deleteAllPoints().subscribe(data => {
                console.log(data);
            },
            error => {
                console.log("error");
            });
    }
}
