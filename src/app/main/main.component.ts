import {AfterViewInit, Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  @ViewChild('userLabel') userLabel

  ngAfterViewInit() {
    this.setUserLabel()
  }

  private setUserLabel(): void {
    this.userLabel.nativeElement.innerText = 'Текущий пользователь: ' + localStorage.getItem('username')
  }

  logOut(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }
}
