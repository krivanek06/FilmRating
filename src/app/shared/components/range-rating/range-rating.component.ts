import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-range-rating',
  templateUrl: './range-rating.component.html',
  styleUrls: ['./range-rating.component.scss']
})
export class RangeRatingComponent implements OnInit {
  @Input() name: string;

  value = 50;

  constructor() {
  }

  ngOnInit(): void {
  }

  clearValue() {
    this.value = 50;
  }

}
