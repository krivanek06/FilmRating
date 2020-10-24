import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChartOptions, ChartPluginsOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {FirebaseMovieDetailRating} from '../../../pages/details/components/comment-section/models/comment-section.model';

@Component({
  selector: 'app-film-rating-chart',
  templateUrl: './film-rating-chart.component.html',
  styleUrls: ['./film-rating-chart.component.scss']
})
export class FilmRatingChartComponent implements OnInit, OnChanges {
  @Input() ratings: FirebaseMovieDetailRating[] = [];
  @Input() fillWithEmptyData = false;

  pieChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: {
      position: 'top',
      labels: {
        fontColor: '#d7d7d7'
      }
    },
    tooltips: {
      enabled: true,
      mode: 'single'
      /*callbacks: {
        label(tooltipItems, data) {
          return  tooltipItems.label + " : " + data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }*/
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {

          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;
          // @ts-ignore
          dataArr.map(data => {
            sum += data;
          });
          const percentage = (value * 100 / sum).toFixed(2) + '%';
          return percentage;


        },
        color: '#fff',
        font: {
          /*weight: 'bold',*/
          size: 12,
        }
      }
    },

  };

  pieChartLabels: Label[] = []; // ['Nitrogen', 'Oxygen', 'Argon', 'Carbon dioxide'];

  pieChartData: number[] = []; // [78.09, 20.95, 0.93, 0.03];

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins: ChartPluginsOptions = [pluginDataLabels];

  pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor() {
  }


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.ratings.currentValue) {
      this.ratings = changes.ratings.currentValue;
      if (this.ratings.length === 0) {
        return;
      }
      // average data
      let result: FirebaseMovieDetailRating[] = [];
      this.ratings.forEach(rating => {
        const tmp = result.find(x => x.type === rating.type);
        if (tmp) {
          tmp.rate += rating.rate;
        } else {
          result = [...result, {rate: rating.rate, type: rating.type}];
        }
      });

      // only applied when overall rating
      if (this.fillWithEmptyData) {
        const maximum = this.ratings.length * 100;
        result = [...result, {type: 'Unsatisfied', rate: maximum - result[0].rate}];
      }

      this.pieChartLabels = result.map(x => x.type);
      this.pieChartData = result.map(x => x.rate);
    }

  }

}
