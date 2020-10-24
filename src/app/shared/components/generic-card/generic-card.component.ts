import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-generic-card',
    templateUrl: './generic-card.component.html',
    styleUrls: ['./generic-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericCardComponent implements OnInit {
    @Input() title: string;
    @Input() subTitle: string;

    constructor() {
    }

    ngOnInit() {
    }

}
