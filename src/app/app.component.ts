import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {ThemeService} from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'FilmRating';

  constructor(
    private platform: Platform,
    private themeService: ThemeService
  ) {
    this.themeService.enableDark();

  }

}
