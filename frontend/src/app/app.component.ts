import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  opened = true;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  routeLoading: boolean;

  constructor(
    private router: Router
  ) { 
    
  }
  
  ngOnInit() {
    this.router.events.subscribe(
      event => {
        if(event instanceof NavigationStart) {
          this.routeLoading = true;
          window.scrollTo(0,0);
        }

        if(event instanceof NavigationEnd) {
          this.routeLoading = false;
        }
      }
    );
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }
}
