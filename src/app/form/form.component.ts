import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {Point} from "../point";
import Swal from "sweetalert2";
import {PointService} from "../service/point.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit {
    point: Point = new Point();

    xButtons = document.getElementsByClassName('x-button')
    rButtons = document.getElementsByClassName('r-button')
    yInputs = document.getElementsByClassName('y-input')
    lastCorrectY = ''

    constructor(private pointService: PointService) {
        localStorage.setItem("R", "undefined")
    }

    ngAfterViewInit() {

        for (const xButton of Array.from(this.xButtons)) {
            xButton.addEventListener('click', (event: MouseEvent) => {
                this.changeXButtonColor(event)
            });
        }


        for (const rButton of Array.from(this.rButtons)) {
            rButton.addEventListener('click', (event: MouseEvent) => {
                this.changeRButtonColor(event)
            });
        }

        for (const yInput of Array.from(this.yInputs)) {
            yInput.addEventListener('input', (event) => {
                this.checkY(event)
            });
        }


    }


    setX(xValue: number): void {
        this.point.x = xValue;
        console.log('X selected')
    }

    setR(rValue: number): void {
        if (rValue >= 0) {
            this.point.r = rValue;
        }
        console.log('R selected')
    }

    changeXButtonColor(event): void {
        console.log("CHANGING")
        this.resetXButtons()
        event.target.classList.remove('a-button-usual-color');
        event.target.classList.add("a-button-unusual-color")
        // setXValue(event.target.innerText)

    }

    changeRButtonColor(event): void {
        console.log("CHANGING")
        if (+event.target.innerText >= 0) {
            localStorage.setItem("R", event.target.innerText)
            this.resetRButtons()
            event.target.classList.remove('a-button-usual-color');
            event.target.classList.add("a-button-unusual-color")
            // setRValue(event.target.innerText)
        } else {
            this.showError("R should be more than zero")

        }


    }

    resetXButtons(): void {
        for (const xButton of Array.from(this.xButtons)) {

            xButton.classList.remove('a-button-unusual-color')
            xButton.classList.add("a-button-usual-color")

        }

    }

    resetRButtons(): void {
        for (const rButton of Array.from(this.rButtons)) {

            rButton.classList.remove('a-button-unusual-color')
            rButton.classList.add("a-button-usual-color")

        }

    }

    checkY(event): void {
        const target = event.target as HTMLInputElement;
        let value = +target.value
        if (isNaN(value)) {
            target.value = this.lastCorrectY
        } else if (value <= -5 || value >= 5) {
            target.value = this.lastCorrectY
        } else {
            this.point.y = +target.value
            this.lastCorrectY = target.value
        }
        console.log(target.value);
    }

    onSubmit(): void {
        if (this.point.x === undefined) {
            this.showError('X is not selected')
        } else if (this.point.y === undefined || this.lastCorrectY === '') {
            this.showError('Y is empty')
        } else if (this.point.r === undefined) {
            this.showError('R is not selected')
        } else {
            console.log("SUBMIT")
            console.log(this.point.x)
            this.pointService.createPoint(this.point).subscribe(data => {
                    console.log(data);
                },
                error => {
                    console.log(error);
                });



        }

    }

    showError(text): void {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: text,
            showConfirmButton: false,
            timer: 1500
        });
    }
}
