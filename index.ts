import './style.css';

import { Chart, ChartOptions, ChartEvent } from 'chart.js/auto';
// import { getRelativePosition } from 'chart.js/helpers';
import * as dragData from 'chartjs-plugin-dragdata';
import ChartJSdragSegment from 'chartjs-plugin-dragsegment';

const DATA_COUNT = 7;

const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const tempRange = document.getElementById('tempRange');
tempRange.addEventListener('change', onTempValueChange);

const plugins = [dragData, ChartJSdragSegment];
// const plugins = [ChartJSdragSegment];

Chart.register(plugins);

const config: ChartOptions = {
  type: 'line',
  data: {
    labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    datasets: [
      {
        label: '  Temperature',
        data: [10, 13, 13, 15, 6, 9],
        borderWidth: 2,
        borderColor: '#ff0016',
        backgroundColor: '#11aa88',
      },
      {
        data: [11, 12.5, 12.8, 14, 4.4, 8.5],
        borderWidth: 1,
        borderColor: 'rgba(255,0,0,0.4)',
        backgroundColor: 'rgba(255,0,0,0)',
      },
      {
        data: [10.5, 12.3, 12.6, 13.8, 3, 7.9],
        borderWidth: 2,
        borderColor: 'rgba(255,0,0,0.1)',
        backgroundColor: 'rgba(255,0,0,0)',
      },
      {
        label: '  Pressure',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        tension: 0.0,
        borderWidth: 1,
        borderColor: '#4dc9f6',
        backgroundColor: '#000000',
        pointHitRadius: 25,
        borderCapStyle: 'square',
        borderJoinStyle: 'bevel', // round, miter
        pointStyle: 'rect', // "circle" | "cross" | "crossRot" | "dash" | "line" | "rect" | "rectRounded" | "rectRot" | "star" | "triangle" | HTMLImageElement | HTMLCanvasElemen
        radius: 6,
        rotation: 45,
        stepped: 'middle', // true/false, 'before', ' middle' 'after'
      },
      {
        label: '  Velocity',
        data: [7, 11, 5, 8, 3, 7],
        fill: false,
        tension: 0.4,
        borderWidth: 4,
        borderDash: [12, 4, 4, 4],
        borderColor: '#4dc900',
        backgroundColor: '#ffffff',
        pointHitRadius: 5,
      },
    ],
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 20,
      },
    },
    onHover: function (e: ChartEvent) {
      const point = chart.getElementsAtEventForMode(
        e.native,
        'nearest',
        { intersect: true },
        false
      );
      if (point.length) e.native.target.style.cursor = 'grab';
      else e.native.target.style.cursor = 'default';
    },
    onClick: function (e: ChartEvent) {
      console.log(
        chart.getElementsAtEventForMode(
          e.native,
          'dataset', // index, dataset, point, nearest, x,y
          { intersect: false },
          false
        )
      );
    },
    plugins: {
      legend: {
        labels: {
          filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
            return item.text !== undefined;
          },
        },
      },

      dragSegment: {
        // allow to drag segments verticaly (default: true)
        vertical: true,

        // allow to drag segments horizontaly (default: false)
        horizontal: false,

        // onDrag will be executed before coordinates updating
        // @chart - ChartJS instance
        // @points - Object , of points {x, y} for each dataset, witch will update their coordinates
        //   points = {
        //     datasetIndex: {
        //       elementIndex: {
        //         x // optional, not present if not modified
        //         y // optional, not present if not modified
        //       }
        //     }
        //   }
        //   You can set new values (add, remove, ...) for points
        onDragStart: (chart, points) => {
          console.log('drag seg start');
          return true;
        },
        onDrag(chart, points) {
          console.log('drag seg');
          /*if (Math.random() < 0.5) {
            return false;
          }*/
          return true;
        },
      },
      
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (e, datasetIndex, index, value) {
          // console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing';
          //console.log(e, datasetIndex, index, value)
          return value >=2 && value <=19
        },
        onDragEnd: function (e, datasetIndex, index, value) {
          e.target.style.cursor = 'default';
          //console.log(datasetIndex, index, value)
        },
      },
    },
  },
};

const chart = new Chart(ctx, config);
tempRange.setAttribute('value', String(chart.data.datasets[0].borderWidth));

export function onTempValueChange(ev: any) {
  ev.preventDefault();
  console.log(`changed ${this}: ${ev.target.value}`);
  chart.data.datasets[0].borderWidth = ev.target.value;
  setTimeout(() => chart.update('none'), 100);
}
