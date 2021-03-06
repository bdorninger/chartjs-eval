import { ChartConfiguration, ChartEvent } from 'chart.js';

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
        backgroundColor: '#11aa88',
        hidden: false,
      },
      /* {
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
      },*/
    ],
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 20,
        suggestedMin: 1,
        suggestedMax: 19,
      },
      x: {
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
      },

      /*crosshair: {
        line: {
          color: '#F66', // crosshair line color
          width: 1, // crosshair line width
        },
        sync: {
          enabled: true, // enable trace line syncing with other charts
          group: 1, // chart group
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
      },*/
      //
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (e, datasetIndex, index, value) {
          // console.log(e)
        },
        onDrag: function (e, datasetIndex, index, value: Point) {
          e.target.style.cursor = 'grabbing';
          // console.log(e, datasetIndex, index, value)
          return value.y >= 2 && value.y <= 19;
        },
        onDragEnd: function (e, datasetIndex, index, value: Point) {
          e.target.style.cursor = 'default';
          console.log(datasetIndex, index, value);
          return false;
        },
      },
    },
  },
};
