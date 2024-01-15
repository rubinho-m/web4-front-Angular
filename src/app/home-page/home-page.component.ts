import {Component} from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  currentDate: string = '';
  currentTime: string = '';

  constructor() {
    this.updateDate();
    this.updateTime();
    setInterval(() => this.updateDate(), 8000);
    setInterval(() => this.updateTime(), 8000);
  }

  updateDate() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString().replace(/\//g, '.');
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  getUserStatus(): boolean {
    return (localStorage.getItem('username') !== null && localStorage.getItem('token') == 'token')
  }

}
