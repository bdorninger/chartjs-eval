import './style.css';

import colorLib, { Color } from '@kurkle/color';

import {
  Chart,
  ChartEvent,
  Point,
  ChartConfiguration,
  LineOptions,
} from 'chart.js/auto';

import dragData from 'chartjs-plugin-dragdata';
import zoomPlugin from 'chartjs-plugin-zoom';

// CROSSHAIR no import method yields a stable, usable plugin object....
// imports undefined
// import CrosshairPlugin from 'chartjs-plugin-crosshair';

// import CrosshairPlugin from 'chartjs-plugin-crosshair'; // this one imports undefined
// import Interpolate from 'chartjs-plugin-crosshair';

/* this one imports an object with one entry "default": {} resulting in an   
   error on initializing the chart plugins when resgistered as imported
   if registered via CrosshairPlugin.default, the chart is being drawn,
   but the crosshair/zoom does still not work
   Debugging shows, the register method did not fail, but didn't insert anything into the plugin registry either
*/
import * as CrosshairPlugin from 'chartjs-plugin-crosshair';
import { LineElement, LineProps, Segment, TooltipItem } from 'chart.js';

// DRAG SEGMENT: API incompatible!
// import ChartJSdragSegment  from 'chartjs-plugin-dragsegment'; // API incompatible (chart.js 2.x?)

const DATA_COUNT = 7;
let col: Color;
const ctx = (
  document.getElementById('myChart') as HTMLCanvasElement
).getContext('2d');

const tempRange = document.getElementById('tempRange');
tempRange.addEventListener('change', onTempValueChange);

const selPos = document.getElementById('posSel');
selPos.addEventListener('change', onSelectionPositionChange);

console.log(`crosshair: ${JSON.stringify(CrosshairPlugin)}`);
// console.log(`dragdate: ${JSON.stringify(ChartJSdragDataPlugin)}`);
// const plugins = [CH.CrosshairPlugin];

Chart.register(dragData, zoomPlugin, CrosshairPlugin.default);
//Interaction.modes.interpolate = Interpolate;

const reg = Chart.registry.plugins;

const selectionBarData = [
  { x: 2.5, y: -0.5 },
  { x: 2.5, y: 20 },
];

const config: ChartConfiguration = {
  type: 'line',
  data: {
    // labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
    datasets: [
      {
        label: '  Temperature',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 13 },
          { x: 3, y: 13 },
          { x: 4, y: 15 },
          { x: 5, y: 7 },
          { x: 6, y: 9 },
        ],
        borderWidth: 2,
        borderColor: '#ff0016',
        backgroundColor: '#00ffee',
        hidden: false,
        fill: false,
        segment: {
          borderWidth: (ctx, opt) => (ctx.p0.y === ctx.p1.y ? 10 : undefined),
          borderColor: (ctx, opt) =>
            ctx.p0.y === ctx.p1.y
              ? colorLib('#ffaa00').alpha(0.2).rgbString()
              : undefined,
          backgroundColor: (ctx, opt) => {
            //console.log('line', l.start);
            return ctx.p0.y === ctx.p1.y ? '#ffffff' : undefined;
          },
          borderCapStyle: () => undefined,
          borderDash: () => undefined,
          borderDashOffset: () => undefined,
          borderJoinStyle: () => undefined,
        },
      },
      {
        label: undefined,
        data: selectionBarData,
        borderWidth: 35,
        borderColor: colorLib('#ff00aa').alpha(0.2).rgbString(),
        radius: 0,
        fill: false,
      },
      /*{
        data: [11, 12.5, 12.8, 14, 4.4, 8.5],
        borderWidth: 1,
        borderColor: 'rgba(255,0,0,0.4)',
        backgroundColor: 'rgba(255,0,0,0)',
      },*/
      /*{
        data: [10.5, 12.3, 12.6, 13.8, 3, 7.9],
        borderWidth: 2,
        borderColor: 'rgba(255,0,0,0.1)',
        backgroundColor: 'rgba(255,0,0,0)',
      },*/
      {
        label: '  Pressure',
        data: [
          { x: 1, y: 4 },
          { x: 2, y: 5 },
          { x: 3.5, y: 4 },
          { x: 4, y: 3 },
          { x: 5, y: 7 },
          { x: 6, y: 11 },
          { x: 7, y: 10 },
        ],
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
      /*{
        label: '  Velocity',
        data: [7, 11, 5, 8, 3, 7],
        fill: false,
        tension: 0.4,
        borderWidth: 4,
        borderDash: [12, 4, 4, 4],
        borderColor: '#4dc900',
        backgroundColor: '#ffffff',
        pointHitRadius: 5,
      },*/
    ],
  },
  options: {
    scales: {
      y: {
        //offset: true,
        min: 0,
        max: 20,
        bounds: 'data',
        //suggestedMin: 0,
        //suggestedMax: 20,
        ticks: {
          stepSize: 2,
        },
      },
      x: {
        /*position: {
          y: 4,
        },*/
        //offset: true,
        type: 'linear',
        title: {
          display: true,
          text: 'Foo',
        },
        ticks: {
          callback: function (val: number, index) {
            // Hide every 2nd tick label
            return val % 2 === 0 ? String(val) : '';
          },
          color: 'green',
        },
        min: 0,
        max: 10,
        // bounds: 'data'
      },
    },
    // drag segment is not working with 3.6.1
    //
    /* dragSegment: {
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
        if (Math.random() < 0.5) {
          return false;
        }
        return true;
      },
    },*/
    onHover: function (e: ChartEvent) {
      const point = chart.getElementsAtEventForMode(
        e.native,
        'nearest',
        { intersect: true },
        false
      );
      if (point.length) {
        (e.native.target as HTMLElement).style.cursor = 'grab';
      } else {
        (e.native.target as HTMLElement).style.cursor = 'default';
      }
    },
    onClick: function (e: ChartEvent) {
      console.log(
        `chart ev ${e.type}@${e.x},${e.y}`,

        chart.getElementsAtEventForMode(
          e.native,
          'dataset', // index, dataset, point, nearest, x,y
          { intersect: false },
          false
        )
      );
      return true;
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          modifierKey: 'alt',
          overScaleMode: undefined,
          threshold: 10,
        },
        limits: {
          x: { min: -1, max: 15 },
          y: { min: -1, max: 25 },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
      legend: {
        labels: {
          filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
            return item.text !== undefined;
          },
        },
      },

      tooltip: {
        mode: 'point',
        intersect: false,
        bodyColor: '#000000',
        backgroundColor: colorLib('#ffffff').alpha(0.6).rgbString(),
        borderWidth: 1,
        borderColor: '#000000',
        titleColor: '#000000',
        footerColor: '#ffffff',
        cornerRadius: 0,
        callbacks: {
          title: (ttips: TooltipItem<'line'>[]) => {
            console.log(ttips[0].dataset);
            return 'My-Title';
          },
          label: (ttips) => 'mylabel',
        },
      },

      crosshair: {
        line: {
          color: '#F66', // crosshair line color
          width: 1, // crosshair line width
        },
        sync: {
          enabled: false, // enable trace line syncing with other charts
          // group: 1, // chart group
          suppressTooltips: false, // suppress tooltips when showing a synced tracer
        },
        zoom: {
          enabled: true, // enable zooming
          zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // background color of zoom box
          zoomboxBorderColor: '#48F', // border color of zoom box
          zoomButtonText: 'Reset Zoom', // reset zoom button text
          zoomButtonClass: 'reset-zoom', // reset zoom button class
        },
        callbacks: {
          beforeZoom: () =>
            function (start, end) {
              // called before zoom, return false to prevent zoom
              return true;
            },
          afterZoom: () =>
            function (start, end) {
              // called after zoom
            },
        },
      },
      //
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (e, datasetIndex, index, value) {
          // console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value: number | Point) {
          e.target.style.cursor = 'grabbing';
          // console.log(e, datasetIndex, index, value)
          if (typeof value === 'number') {
            return value >= 2 && value <= 19;
          }
          return value.y >= 2 && value.y <= 19;
        },
        onDragEnd: function (e, datasetIndex, index, value: number | Point) {
          e.target.style.cursor = 'default';
          console.log(datasetIndex, index, value);
          return false;
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

export function onSelectionPositionChange(ev: any) {
  ev.preventDefault;
  const val = ev.target.value;
  selectionBarData[0].x = val;
  selectionBarData[1].x = val;
  setTimeout(() => chart.update('none'), 100);
}
