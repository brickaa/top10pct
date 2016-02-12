// import './includes/adLoader';

/* global d3, $ */

(function() {
  'use strict';

  var windowWidth = $(window).width;

  console.log(windowWidth);
  
  function drawScatter(dataFile, graphic, location, label) {
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = parseInt(d3.select('#charts').style('width'), 10) - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    /* 
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */ 

    if (graphic === 'atRisk') {
      var yValue = function(d) { return d.atRiskPct;}; // data -> value
    } else if (graphic === 'ecoDis') {
      var yValue = function(d) { return d.ecoDisPct;}; // data -> value
    }

    // setup x 
    var xValue = function(d) { return d.enrolled2015PctSeniors;}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient('bottom');

    // setup y
    var yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient('left');

    // setup fill color
    var cValue = function(d) { return d.Manufacturer;},
        color = d3.scale.category10();

    // add the graph canvas to the body of the webpage
    var svg = d3.select(location).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // add the tooltip area to the webpage
    var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // load data
    d3.csv('/assets/data/' + dataFile, function(error, data) {

      // change string (from CSV) into number format
      data.forEach(function(d) {
        d.enrolled2015PctSeniors = +d.enrolled2015PctSeniors;
        d.ecoDisPct = +d.ecoDisPct;
        d.atRiskPct = +d.atRiskPct;
      });

      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
      yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);


      // x-axis
      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis
            .scale(xScale)
            .orient('bottom')
            .ticks(5, '%'))
          .append('text')
            .attr('class', 'label')
            .attr('x', 0)
            .attr('y', 28)
            .style('text-anchor', 'start')
            .text('Percent of Seniors Enrolled');

      // y-axis
      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis
            .scale(yScale)
            .orient('left')
            .ticks(10, '%'))
          .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', -(margin.left - 10))
            .attr('x', 0);
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Percent of School' + label);

      // draw dots
      svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 1)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .style('fill', function(d) { return color(d.Color);}) 
            .on('mouseover', function(d) {
              tooltip.transition()
                   .duration(200)
                   .style('opacity', .9);
              tooltip.html(d.value + '<br/> (' + xValue(d) 
              + ', ' + yValue(d) + ')')
                   .style('left', (d3.event.pageX + 5) + 'px')
                   .style('top', (d3.event.pageY - 28) + 'px');
          })
          .on('mouseout', function(d) {
            tooltip.transition()
                 .duration(500)
                 .style('opacity', 0);
          });

      // draw legend
      var legend = svg.selectAll('.legend')
          .data(color.domain())
            .enter().append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i) { return 'translate(0,' + i * 20 + ')'; });

      legend.append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

      legend.append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) { return d; });

      d3.select(window).on('resize', resize); 

      function resize() {
          // update width
          width = parseInt(d3.select('#charts').style('width'), 10);
          width = width - margin.left - margin.right;

          d3.select(location).select('svg')
              .attr('width', width + margin.left + margin.right);

          // resize the chart
          xScale.range([0, width]);
          xMap = function(d) { return xScale(xValue(d));}; // data -> display
          xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          // update axes
          svg.select('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis
              .scale(xScale)
              .orient('bottom')
              .ticks(5, '%'));

          svg.selectAll('.dot')
              .attr('class', 'dot')
              .attr('cx', xMap);

          legend.select('rect')
            .attr('x', width - 18)
            .attr('width', 18);

          legend.select('text')
            .attr('x', width - 24);    
      }
    });
  }

  function load() {
    drawScatter('feeder100.csv', 'ecoDis', '#graphicEcoDis', 'Economically Disadvantaged');
  }
  window.onload = load;
})();