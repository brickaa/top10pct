/* global $, d3, CONFIG */

var margin = {top: 10, right: 10, bottom: 30, left: 30},
    width = parseInt(d3.select('.chart-container_scatter').style('width'), 10) - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//   // setup x 
var xScale = d3.scale.linear().range([0, width]), // value -> display
    xAxis = d3.svg.axis().scale(xScale).orient('bottom');

// setup y
var yScale = d3.scale.linear().range([height, 0]), // value -> display
    yAxis = d3.svg.axis().scale(yScale).orient('left');

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

    console.log(austin);

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

  //     // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
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

    // draw dots
    svg.selectAll('.dot')
        .data(data)
        .enter().append('circle')
          .attr('class', 'dot')
          .attr('r', 1.5)
          .attr('cx', xMap)
          .attr('cy', yMap);

    function reDot(data) {
      var dots = svg.selectAll('.dot');
      dots.remove();

      xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);

      // draw dots
      svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 1.5)
            .attr('cx', xMap)
            .attr('cy', yMap);
    }

    $('#all').click(function() {
      reDot(data);
    });

    $('#austin').click(function() {
      reDot(austin);
    });

    $('#dallas').click(function() {
      reDot(dallas);
    });

    $('#houston').click(function() {
      reDot(houston);
    });

    $('#sanantonio').click(function() {
      reDot(sanantonio);
    });
  });

});