import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-range-rating',
  templateUrl: './range-rating.component.html',
  styleUrls: ['./range-rating.component.scss']
})
export class RangeRatingComponent implements OnInit {
  @Output() valueEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Input() name: string;

  value = 50;

  constructor() {
  }

  ngOnInit(): void {
  }

  clearValue() {
    this.value = 50;
  }

  change(change: any) {
    this.value = change;
    this.valueEmitter.emit(this.value);
  }
}
