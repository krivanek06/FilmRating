import { Component, OnInit } from '@angular/core';
import {FilmDataService} from '../../api/film-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MovieDetails} from '../../api/film-data.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  filmDetails$: Observable<MovieDetails>;

  constructor(private filmDataService: FilmDataService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // TEST - try url http://localhost:4200/details/603 and check console
    this.filmDetails$ = this.route.paramMap.pipe(
      switchMap((data: any) => this.filmDataService.getMovieDetails(data.params.id))
    );

    this.filmDetails$.subscribe(x => console.log(x));
  }

}
