/* global $, d3, CONFIG */

import './includes/chosen.jquery.js';

var margin = {top: 10, right: 10, bottom: 30, left: 30},
    width = parseInt(d3.select('.chart-container_scatter').style('width'), 10) - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//   // setup x 
var xScale = d3.scale.linear().range([0, width]), // value -> display
    xAxis = d3.svg.axis().scale(xScale).orient('bottom');

// setup y
var yScale = d3.scale.linear().range([height, 0]), // value -> display
    yAxis = d3.svg.axis().scale(yScale).orient('left');

// add the tooltip area to the webpage
var tooltip = d3.select('.tooltip-container').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

d3.csv(CONFIG.projectPath + 'assets/data/feeder100.csv', function(error, data) {
  data = data.map( function (d) {
    return { 
      name: d.Name,
      metro: d.Metro_Area,
      city: d.City,
      enrolledpct: d.enrolled2015PctSeniors,
      minority: d.BlackHispMulti,
      white: d.WhiteOther,
      atrisk: d.atRiskPct,
      ecodis: d.ecoDisPct,
      collegeready: d.collegeReadyBothPct,
      avgsat: d.avgSAT,
      avgact: d.avgACT,
      admitted: d.Admitted2015,
      enrolled: d.Enrolled2015,
      color: d.Color
    };
  });

  var count = data.length;

  $.each(data, function(d, i) { 
    $('#chosen-select')
      .append($('<option></option>')
      .attr('value', i.name)
      .text(i.name)); 

    if (!--count) {
      $('#chosen-select').chosen({
        allow_single_deselect: true // not working
      });
    }
  });

});

var charts = ['ecoDis', 'collegeReady'];

charts.forEach(function(chart, index) {

  // Build SVG Container
  var svg = d3.select('#' + chart).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('id', chart)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Load Data
  d3.csv(CONFIG.projectPath + 'assets/data/feeder100.csv', function(error, data) {
    // Color assignments
    var color = d3.scale.ordinal().range(['#90D3C8','#FF6249','#8DC967','#8DC967','#FFD454']);
      
    data = data.map( function (d) {
      return { 
        name: d.Name,
        metro: d.Metro_Area,
        city: d.City,
        enrolledpct: d.enrolled2015PctSeniors,
        minority: d.BlackHispMulti,
        white: d.WhiteOther,
        atrisk: d.atRiskPct,
        ecodis: d.ecoDisPct,
        collegeready: d.collegeReadyBothPct,
        avgsat: d.avgSAT,
        avgact: d.avgACT,
        admitted: d.Admitted2015,
        enrolled: d.Enrolled2015,
        color: d.Color
      };
    });

    var nest = d3.nest().key(function(d) { return d.metro; }).entries(data);
    
    var austin = [],
        dallas = [],
        houston = [],
        sanantonio = [];

    austin.push(nest[0]);
    dallas.push(nest[1]);
    houston.push(nest[2]);
    sanantonio.push(nest[3]);

    var austin = austin[0].values,
        dallas = dallas[0].values,
        houston = houston[0].values,
        sanantonio = sanantonio[0].values;

    var yValue;

    if (chart === 'atRisk') {
      yValue = function(d) { return d.atrisk; };   
    } else if (chart === 'ecoDis') {   
      yValue = function(d) { return d.ecodis; };
    } else if (chart === 'collegeReady') {
      yValue = function(d) { return d.collegeready; };
    }

    var xValue = function(d) { return d.enrolledpct;},
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        yMap = function(d) { return yScale(yValue(d));}; // data -> display

    function dot(data) {
      var dots = svg.selectAll('.dot');
      dots.remove();

      xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
      yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

      // draw dots
      svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 1.5)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .style('fill', function(d) { return color(d.color); })
            .on('mouseover', function(d) {
              tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
              tooltip.html(d.name);
            })
            .on('mouseout', function(d) {
              tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            });
    }

    dot(data);
    yScale.domain([0, 1]);

    // x-axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis
          .scale(xScale)
          .orient('bottom')
          .ticks(5, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 28)
          .style('text-anchor', 'start')
          .text('Percent of Seniors Enrolled at UT-Austin');

    // y-axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis
          .scale(yScale)
          .orient('left')
          .ticks(10, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', -(margin.left - 10))
          .attr('x', 0)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Percent of School TEST');

    $('#all').click(function() {
      dot(data);
    });

    $('#austin').click(function() {
      dot(austin);
    });

    $('#dallas').click(function() {
      dot(dallas);
    });

    $('#houston').click(function() {
      dot(houston);
    });

    $('#sanantonio').click(function() {
      dot(sanantonio);
    });
  });

});