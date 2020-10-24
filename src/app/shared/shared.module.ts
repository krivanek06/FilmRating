import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {RouterModule} from '@angular/router';
import {AppMaterialModule} from './appMaterial.module';
import {FilmCardsComponent} from './components/film-cards/film-cards.component';
import {HeaderComponent} from './components/header/header.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {IonicModule} from '@ionic/angular';
import {RangeRatingComponent} from './components/range-rating/range-rating.component';
import {MentionModule} from 'angular-mentions';
import {FilmPosterCardComponent} from './components/film-poster-card/film-poster-card.component';
import {NumberFormatterPipe} from './pipes/numberFormatter.pipe';
import {GenericCardComponent} from './components/generic-card/generic-card.component';
import {FilmRatingChartComponent} from './components/film-rating-chart/film-rating-chart.component';
import {ChartsModule} from 'ng2-charts';


@NgModule({
  declarations: [
    FilmCardsComponent,
    HeaderComponent,
    RangeRatingComponent,
    FilmPosterCardComponent,
    NumberFormatterPipe,
    GenericCardComponent,
    FilmRatingChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MentionModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AppMaterialModule,
    ChartsModule,
    IonicModule,
    NgCircleProgressModule.forRoot({
      radius: 22,
      outerStrokeWidth: 5,
      innerStrokeWidth: 8,
      outerStrokeColor: '#30c005',
      innerStrokeColor: 'transparent',
      animation: true,
      animationDuration: 175,
      unitsFontSize: '14',
      titleFontSize: '14',
      showSubtitle: false,
      showInnerStroke: false,
      unitsColor: '#ededed',
      titleColor: '#EDEDED',
      backgroundColor: '#122545',
      backgroundGradientStopColor: '#0e2c86',
      backgroundPadding: -4
    })
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MentionModule,
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AppMaterialModule,
    IonicModule,
    FilmCardsComponent,
    HeaderComponent,
    RangeRatingComponent,
    FilmPosterCardComponent,
    NumberFormatterPipe,
    GenericCardComponent,
    FilmRatingChartComponent
  ]
})
export class SharedModule { }
