/* global $ */

import './includes/adLoader';
import d3 from 'd3';
import './includes/jquery.waypoints.js';
import './includes/sticky.js';
import './includes/inview.js';
import './includes/demographics.waypoints.js';

var chartHeight;
var chartTopper = $('#chart--topper');
var chartBottom = $('.chart--bottom');

function getHeights() {
  var windowHeight = $(window).height();

  var maxTextHeight = Math.max.apply(null, $('.chart--topper_explainer_text')
    .map(function () { return $(this).height(); }).get());

  var legendHeight = $('.legend').height(),
      chartHeader = $('.chart--header').height(),
      chartBottomHeight = chartBottom.height(),
      chartTopHeight = maxTextHeight + legendHeight + chartHeader + 34;

  chartTopper.height(maxTextHeight + legendHeight);
  chartHeight = (windowHeight - chartTopHeight - chartBottomHeight) * 0.95;
}

getHeights();

var margin = {top: 10, right: 10, bottom: 30, left: 30},
    width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

var parseDate = d3.time.format('%Y%m%d').parse;

var x = d3.time.scale()
    .range([0, width]);
    
var y = d3.scale.linear()
    .range([height,0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y(function(d) { 
      return y(d.percent); 
    });

var charts = ['white', 'black', 'hispanic'];

charts.forEach(function(race, index) {
  // Build SVG Container
  var svg = d3.select('#' + race).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Load Data
  d3.csv('/assets/data/data.csv', function(error, data) {

    // Color assignments
    var color = d3.scale.ordinal().range(['#90D3C8','#FF6249','#8DC967','#8DC967','#FFD454']);
        
    // Map the data to key values in an array
    data = data.map( function (d) { 
      return { 
        group: d.group,
        race: d.race,
        date: parseDate(d.date),
        percent: +d.percent }; 
    });   
    
    // Nest the data on group & race
    // so we can call/draw the chart in different steps
    data = d3.nest().key(function(d) { return d.group; }).key(function(d) { return d.race; }).entries(data);

    // Set X Domain on min/max of dates in nested data
    x.domain([d3.min(data, function(d, i) { return d3.min(d.values[i].values, function (d) { return d.date; }); }),
              d3.max(data, function(d, i) { return d3.max(d.values[i].values, function (d) { return d.date; }); })]);
    
    // Create yDomain variable -- this will change when the chart is rescaled
    var yDomain;

    // Draw initial chart w/ yAxis 0-100%;
    y.domain([0, 1]);

    // Create various data arrays for chart stages
    var dataUT = [],
        dataTX = [],
        dataRace = [],
        dataRaceTX = [],
        dataRaceUT = [];

    dataUT = data[0].values;
    dataTX = data[1].values;
    dataRace.push(dataTX[index], dataUT[index]);
    dataRaceTX.push(dataTX[index]);
    dataRaceUT.push(dataUT[index]);

    // Call resize() on each chart
    d3.select(window).on('resize.' + race, resize).transition();

    // Functions to remove chart elements
    function removeBars() {
      var bars = svg.selectAll('rect');
      bars.remove();
    }

    function removeXAxis() {
      var axis = svg.select('.x.axis');
      axis.remove();
    }

    function removeYAxis() {
      var axis = svg.select('.y.axis');
      axis.remove();
    }

    function removeSeries() {
      var series = svg.selectAll('.group');
      series.remove();
    }

    // Functions to add chart elements
    function addYAxis() {
     svg.append('g')
         .attr('class', 'y axis')
         .call(yAxis.ticks('5', '%').outerTickSize(0));   
    }

    function addBars(data) {
      if (data === 'dataRaceTX') {
        removeBars();
      }

      var bars = svg.selectAll('.bar')
        .data(data, function(d) {
          return d.values[0].group;
        });
    
      bars.exit()
        .transition()
          .duration(300)
        .attr('y', y(0))
        .attr('height', height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // data that needs DOM = enter() (a set/selection, not an event!)
      bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('fill', function(d, i) { return color(d.values[i].group); })
        .attr('y', y(0))
        .attr('height', height - y(0));

      // the 'UPDATE' set:
      bars.transition().duration(1000)
        .attr('x', function(d, i) { return x(d.values[i].date) + (width/4 * (i) + 4); })              .attr('width', width/4)
        .attr('y', function(d, i) { return y(d.values[i].percent); })
        .attr('height', function(d, i) { return y(0) - y(d.values[i].percent); }); // flip the height, because y's domain is bottom up, but SVG renders top down
    }

    function addXAxis() {
      svg.select('.x.axis').remove();
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.outerTickSize(0))
        .selectAll('text')
          .attr('y', 0)
          .attr('x', 9)
          .attr('dy', '.35em')
          .attr('transform', 'rotate(90)')
          .style('text-anchor', 'start');
    }

    function addSeries(addData) {
      removeBars();
      removeSeries();

      if(yDomain && yDomain === 1) {
        resetScale();
      } else if (yDomain) {
        rescale();
      }

      var series = svg.selectAll('.group')
        .data(addData, function(d, i) {
          return d.values[i].group;
        })
        .enter().append('g')
          .attr('class', 'group');

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });

      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength + ' ' + d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(500)
          .ease('linear')
          .attr('stroke-dashoffset', 0);
    }

    function resize() {
      var windowHeight = $(window).height();

      var maxTextHeight = Math.max.apply(null, $('.chart--topper_explainer_text')
        .map(function () { return $(this).height(); }).get());

      var legendHeight = $('.legend').height(),
          chartHeader = $('.chart--header').height(),
          chartBottomHeight = chartBottom.height(),
          chartTopHeight = maxTextHeight + legendHeight + chartHeader + 34;

      chartTopper.height(maxTextHeight + legendHeight);
      chartHeight = (windowHeight - chartTopHeight - chartBottomHeight) * 0.95;

      // update width
      width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right;
      height = chartHeight - margin.top - margin.bottom;

      d3.select('#' + race).select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      // resize the chart width & xAxis
      x.range([0, width]);

      xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      // This checks if the chart has been rescaled
      // so resize() will draw paths on the correct yScale
      if(yDomain && yDomain === 1) {
        resetScale();
      } else if (yDomain) {
        rescale();
      }

      // Check if series exists, if yes - resize xAxis
      if (!svg.selectAll('.group').empty()) {
        addXAxis();
      }

      var series = svg.selectAll('.group');    

      // Remove and redraw paths on resize
      series.select('path').remove();

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });
    
      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength + ' ' + d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(500)
          .ease('linear')
          .attr('stroke-dashoffset', 0);

      // Resize bar width/position
      var bars = svg.selectAll('rect');

      bars.attr('x', function(d, i) { return x(d.values[i].date) + ((width/4) * (i) + 4); })
        .attr('width', width/4);
      
    }

    function rescale() {
      yDomain = d3.max(dataRace, function (c) { 
        return d3.max(c.values, function (d) { return d.percent; });
      });

      y.domain([0, yDomain]);

      y.range([height, 0], 0.1);

      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      // update yAxis, data
      svg.select('.y.axis')
        .transition().duration(1000).ease('sin-in-out')
        .call(yAxis.ticks('5', '%'));

      var series = svg.selectAll('.group');

      // Remove and redraw paths on resize
      series.select('path').remove();

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });
      
      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(300)
          .ease('linear')
          .attr('stroke-dashoffset', 0);

    }

    function resetScale() {
      yDomain = 1;

      y.domain([0,yDomain]);

      y.range([height, 0], 0.1);

      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      // update yAxis, data
      svg.select('.y.axis')
        .transition().duration(1000).ease('sin-in-out')
        .call(yAxis.ticks('5', '%'));

      var series = svg.selectAll('.group');

      // Remove and redraw paths on resize
      series.select('path').remove();

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });
      
      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(300)
          .ease('linear')
          .attr('stroke-dashoffset', 0);      
    }

    addBars(dataRaceTX);
    addYAxis();
    removeXAxis();

    var inview1 = new Waypoint.Inview({
      element: $('#waypoint1')[0],
      enter: function(direction) {
        if (direction === 'down') {
          console.log('enter down 1');
          // addBars(dataRaceTX);
          // addYAxis();
          // removeXAxis();
        } 
      },
      exit: function(direction) {
        if (direction === 'up') {
          console.log('exit up 1');
          // removeBars();
          // removeYAxis();
          // removeXAxis();
        }
      }
    });

    var inview2 = new Waypoint.Inview({
      element: $('#waypoint2')[0],
      enter: function(direction) {
        if (direction === 'down') {
          console.log('enter down 2');
          addBars(dataRace);
          removeXAxis();
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          console.log('exit up 2');
          addBars(dataRaceTX);
          removeXAxis();
        }
      }
    });

    var inview3 = new Waypoint.Inview({
      element: $('#waypoint3')[0],
      enter: function(direction) {
        if (direction === 'down') {
          console.log('enter down 3');
          addXAxis();
          addSeries(dataRaceTX);
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          console.log('exit up 3');
          addBars(dataRace);
          removeSeries();
          removeXAxis();
        }
      }
    });

    var inview4 = new Waypoint.Inview({
      element: $('#waypoint4')[0],
      enter: function(direction) {
        if (direction === 'down') {
          console.log('enter down 4');
          addSeries(dataRace);
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          console.log('exit up 4');
          addSeries(dataRaceTX);
        }
      }
    });

    var inview5 = new Waypoint.Inview({
      element: $('#waypoint5')[0],
      enter: function(direction) {
        if (direction === 'down') {
          console.log('enter down 5');
          rescale();
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          console.log('exit up 5');
          resetScale();
        }
      }
    });
  });

});
