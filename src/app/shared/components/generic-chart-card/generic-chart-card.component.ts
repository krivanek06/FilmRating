import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-generic-chart-card',
    templateUrl: './generic-chart-card.component.html',
    styleUrls: ['./generic-chart-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericChartCardComponent implements OnInit {
    @Input() title: string;
    @Input() subTitle: string;

    constructor() {
    }

    ngOnInit() {
    }

}
