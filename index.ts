import './style.css';

import { Chart, ChartOptions, ChartTypeRegistry } from 'chart.js/auto';
// import { getRelativePosition } from 'chart.js/helpers';
import * as dragData from 'chartjs-plugin-dragdata';
import { rgbString } from '@kurkle/color';


const DATA_COUNT = 7;

const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');

export const plugins = [dragData];
Chart.register(plugins);
const config: ChartOptions = {
  type: 'line',
  data: {
    labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    datasets: [
      { 
        label: "  Temperature",
        data: [10, 13, 13, 15, 6, 9],
        borderColor: '#ff0016',
        backgroundColor: '#11aa88',
      },
      {
        label: '  Pressure',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        tension: 0.2,
        borderWidth: 3,
        borderColor: '#4dc9f6',
        backgroundColor: '#000000',
        pointHitRadius: 25,   
        stepped: true     
      },
      {
        label: '  Velocity',
        data: [7, 11, 5, 8, 3, 7],
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        borderColor: '#4dc900',
        backgroundColor: '#ffffff',
        pointHitRadius: 25,
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
    onHover: function (e) {
      const point = e.chart.getElementsAtEventForMode(
        e,
        'nearest',
        { intersect: true },
        false
      );
      /*if (point.length) e.native.target.style.cursor = 'grab';
      else e.native.target.style.cursor = 'default';*/
    },
    plugins: {
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (e, datasetIndex, index, value) {
          // console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing';
          //console.log(e, datasetIndex, index, value)
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


