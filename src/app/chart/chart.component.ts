import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import Swal from 'sweetalert2';
import {PointService} from "../service/point.service";
import {Point} from "../point";


@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
    @ViewChild('graph') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('graphicInfo') info
    private context: CanvasRenderingContext2D;

    private chartColor = "#223963"
    private inChartColor = "#7188B1"
    private width = 500;
    private height = 500;
    private R = 100;
    private mouse = {
        x: 0,
        y: 0,
        left: false,
        over: false,
        inChart: false
    }

    point: Point = new Point();

    private triangle = [[this.width / 2, this.height / 2], [this.width / 2, (this.height / 2 + this.R)], [this.width / 2 - 2 * this.R, this.height / 2]]
    private rect = [[this.width / 2 + this.R * 2, this.height / 2], [this.width / 2, this.height / 2], [this.width / 2, this.height / 2 - this.R], [this.width / 2 + 2 * this.R, this.height / 2 - this.R]]

    constructor(private pointService: PointService) {
        this.triangle.forEach(point => {
            point[0] -= this.width / 2
            point[1] = -(point[1] - this.height / 2)
        })

        this.rect.forEach(point => {
            point[0] -= this.width / 2
            point[1] = -(point[1] - this.height / 2)
        })

    }

    update(): void {

        requestAnimationFrame(this.update.bind(this));

        let decartX = this.mouse.x - this.width / 2
        let decartY = -(this.mouse.y - this.height / 2)
        let point = [decartX, decartY]
        let inChart = this.checkPointInPolygon(point, this.triangle) || this.checkPointInPolygon(point, this.rect) || this.checkPointInCircle(point, 0, 0, this.R * 2)
        this.mouse.inChart = inChart

        if (inChart) {
            this.clear(this.inChartColor)
        } else {
            this.clear(this.chartColor)
        }


    }


    ngAfterViewInit(): void {
        setInterval(() => this.updateInfo(), 500);


        this.context = this.canvas.nativeElement.getContext('2d');

        requestAnimationFrame(this.update.bind(this));
        this.draw(this.chartColor)

        this.canvas.nativeElement.addEventListener('mouseenter', (event: MouseEvent) => {
            this.mouseEnterHandler(event);
        });

        this.canvas.nativeElement.addEventListener('mousedown', (event: MouseEvent) => {
            this.mouseDownHandler(event);
        });

        this.canvas.nativeElement.addEventListener('mouseleave', (event: MouseEvent) => {
            this.mouseLeaveHandler(event);
        });

        this.canvas.nativeElement.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouseMoveHandler(event);
        });

        // this.canvas.nativeElement.addEventListener('mouseenter', this.mouseEnterHandler)
        // this.canvas.nativeElement.addEventListener('mousemove', this.mouseMoveHandler)
        // this.canvas.nativeElement.addEventListener('mouseleave', this.mouseLeaveHandler)
        // this.canvas.nativeElement.addEventListener('mousedown', this.mouseDownHandler)

    }

    updateInfo(): void {
        console.log("INFO")
        if (localStorage.getItem('R') === 'undefined'){
            this.info.nativeElement.innerText = 'График нарисован для исходных значений R'
        } else {
            this.info.nativeElement.innerText = 'График нарисован для значения R: ' + localStorage.getItem('R')
        }

    }
    mouseDownHandler(event): void {
        let decartX = this.mouse.x - this.width / 2
        let decartY = -(this.mouse.y - this.height / 2)

        let flagR = true;
        // let chosenR = document.getElementById('j_idt10:output').innerText
        let actualRString = localStorage.getItem('R')
        let actualR: number

        if (actualRString !== 'undefined') {
            actualR = +actualRString
        } else {
            actualR = 1
        }

        if (flagR) { // R выбран
            let divX = 100 * 2
            let divY = 100 * 2
            // @ts-ignore
            let requestX = decartX / divX * actualR
            // @ts-ignore
            let requestY = decartY / divY * actualR
            // для R = 100 decartX, decartY
            // console.log(requestX, requestY)

            // console.log(requestX, requestY, chosenR)
            // this.setPoint(requestX, requestY, actualR)
            this.point.x = requestX
            this.point.y = requestY
            this.point.r = actualR

            this.pointService.createPoint(this.point).subscribe(data => {
                    console.log(data);
                },
                error => {
                    console.log("ABOBA")
                    console.log(error);
                });


            if (this.mouse.inChart) {
                console.log("in chart")
                this.clear(this.inChartColor)
            } else {
                console.log("clicked not in area")
            }

        }


    }

    mouseEnterHandler(event): void {
        this.mouse.over = true;

    }

    mouseMoveHandler(event): void {
        const rect = this.canvas.nativeElement.getBoundingClientRect()
        this.mouse.x = event.clientX - rect.left
        this.mouse.y = event.clientY - rect.top

    }

    mouseLeaveHandler(event): void {
        this.mouse.over = false;
    }


    clear(color: string): void {
        this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
        this.draw(color)
    }


    draw(color: string): void {


        let points = []
        let badPoints = []
        this.context.lineWidth = 2;


        let deltaY = 6
        let deltaX = 10
        this.context.font = "14px monospace"

        this.drawChart(this.context, this.width, this.height, this.R, color)

        this.context.fillStyle = 'white'
        this.context.strokeStyle = 'white'


        // x axis

        this.context.beginPath();
        this.context.moveTo(0, this.height / 2)
        this.context.lineTo(this.width, this.height / 2)
        this.context.stroke()
        this.context.closePath()

        // y axis

        this.context.beginPath();
        this.context.moveTo(this.width / 2, 0)
        this.context.lineTo(this.width / 2, this.height)
        this.context.stroke()
        this.context.closePath()

        // y arrow
        let length = 7
        this.context.beginPath();
        this.context.moveTo(this.width / 2 - length, length)
        this.context.lineTo(this.width / 2, 0)
        this.context.lineTo(this.width / 2 + length, length)
        this.context.fill()
        this.context.closePath()

        // x arrow

        this.context.beginPath();
        this.context.moveTo(this.width - length, this.height / 2 - length)
        this.context.lineTo(this.width - length, this.height / 2 + length)
        this.context.lineTo(this.width, this.height / 2)
        this.context.fill()
        this.context.closePath()

        // x text

        this.context.fillText('R/2', this.width / 2 + this.R, this.height / 2 - deltaY)
        this.context.fillText('R', this.width / 2 + this.R * 2, this.height / 2 - deltaY)

        this.context.fillText('-R/2', this.width / 2 - this.R - deltaX, this.height / 2 - deltaY)
        this.context.fillText('-R', this.width / 2 - this.R * 2 - deltaX, this.height / 2 - deltaY)

        //y text

        this.context.fillText('R/2', this.width / 2 + deltaX, this.height / 2 - this.R)
        this.context.fillText('R', this.width / 2 + deltaX, this.height / 2 - this.R * 2)

        this.context.fillText('-R/2', this.width / 2 + deltaX, this.height / 2 + this.R)
        this.context.fillText('-R', this.width / 2 + deltaX, this.height / 2 + this.R * 2)

        // points

        this.drawPoint(this.context, this.width / 2, this.height / 2, 5, 'white')

        this.drawPoint(this.context, this.width / 2 - this.R, this.height / 2, 5, 'white')
        this.drawPoint(this.context, this.width / 2 - this.R * 2, this.height / 2, 5, 'white')
        this.drawPoint(this.context, this.width / 2 + this.R, this.height / 2, 5, 'white')
        this.drawPoint(this.context, this.width / 2 + this.R * 2, this.height / 2, 5, 'white')
        this.drawPoint(this.context, this.width / 2, this.height / 2 - this.R, 5, 'white')
        this.drawPoint(this.context, this.width / 2, this.height / 2 - this.R * 2, 5, 'white')
        this.drawPoint(this.context, this.width / 2, this.height / 2 + this.R, 5, 'white')
        this.drawPoint(this.context, this.width / 2, this.height / 2 + this.R * 2, 5, 'white')


        let table = document.getElementsByTagName('table')[0]
        let rows = table.getElementsByTagName("tr")
        // let actualR = document.getElementById('j_idt10:output').innerText;
        let actualRString = localStorage.getItem('R')
        let actualR: number

        // this.checkGraphInfo(actualR)
        try {
            for (let i = 1; i < rows.length; i++) {
                let row = rows[i];
                let cells = row.getElementsByTagName("td");
                let cellX = cells[0].innerText
                let cellY = cells[1].innerText
                let cellR = cells[2].innerText

                if (actualRString !== 'undefined') {
                    actualR = +actualRString
                } else {
                    actualR = +cellR
                }


                // let result = cells[3].innerText

                let divX = this.width / 2.55
                let divY = this.height / 2.55

                let drawX, drawY


                // @ts-ignore
                drawX = cellX / actualR * divX + this.width / 2
                // @ts-ignore
                drawY = -(cellY / actualR * divY) + this.height / 2


                let result = this.checkChangedR(+cellX, +cellY, +actualR)


                if (result) {
                    points.push([drawX, drawY])
                } else {
                    badPoints.push([drawX, drawY])
                }


            }
        } catch (e) {

        }


        points.forEach(point => {
            this.drawPoint(this.context, point[0], point[1], 5, 'green')
        })
        badPoints.forEach(point => {
            this.drawPoint(this.context, point[0], point[1], 5, 'red')
        })
    }

    drawPoint(context: CanvasRenderingContext2D, x: number, y: number, R: number, color: string): void {
        context.beginPath()
        context.moveTo(x, y)
        context.arc(x, y, R, 0, Math.PI * 2)
        context.fillStyle = color
        context.fill()
        context.closePath()
    }

    drawChart(context: CanvasRenderingContext2D, width: number, height: number, R: number, color: string): void {
        context.fillStyle = color


        context.fillRect(width / 2, height / 2, R * 2, -R)

        //triangle
        context.beginPath()
        context.moveTo(width / 2, height / 2)
        context.lineTo(width / 2 - 2 * R, height / 2)
        context.lineTo(width / 2, height / 2 + R)
        context.fill()
        context.closePath()

        //circle

        context.beginPath()
        context.moveTo(width / 2, height / 2)
        context.arc(width / 2, height / 2, R * 2, Math.PI, 3 * Math.PI / 2)
        context.fill()

    }


    // checkGraphInfo(R): void {
    //     document.getElementById('graphicInfo').innerText = 'График нарисован для значения R: ' + R
    // }

    checkChangedR(x: number, y: number, R: number): boolean {
        return this.isInCircle(x, y, R) || this.isInTriangle(x, y, R) || this.isInRect(x, y, R)
    }

    // r = R  на графике
    isInCircle(x: number, y: number, r: number): boolean {
        return x <= 0 && y >= 0 && x * x + y * y <= r * r
    }

    isInTriangle(x: number, y: number, r: number): boolean {
        return x <= 0 && y <= 0 && y >= - x / 2 - r / 2
    }

    isInRect(x: number, y: number, r: number): boolean {
        return x >= 0 && y >= 0 && x <= r && y <= r / 2
    }


    checkPointInPolygon(point, vs): boolean {
        let x = point[0], y = point[1];

        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            let xi = vs[i][0], yi = vs[i][1];
            let xj = vs[j][0], yj = vs[j][1];

            let intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }

    checkPointInCircle(point, centerX, centerY, radius): boolean {

        return (centerX - point[0]) ** 2 + (centerY - point[1]) ** 2 <= radius ** 2 && point[0] <= 0 && point[1] >= 0;
    }


}
