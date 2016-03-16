/* global $, d3, CONFIG */

import './includes/chosen.jquery.js';

var margin = {top: 10, right: 10, bottom: 30, left: 60},
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

d3.csv(CONFIG.projectPath + 'assets/data/feeder.csv', function(error, data) {
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

    if (i.metro === 'Austin-Round Rock') {
      $('#austin-group').append($('<option></option>')
        .attr('value', i.name)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'Dallas-Fort Worth-Arlington') {
      $('#dallas-group').append($('<option></option>')
        .attr('value', i.name)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'Houston-The Woodlands-Sugar Land') {
      $('#houston-group').append($('<option></option>')
        .attr('value', i.name)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'San Antonio-New Braunfels') {
      $('#sanantonio-group').append($('<option></option>')
        .attr('value', i.name)
        .text(i.name + ' (' + i.city + ')'));
    } else {
      $('#other-group')
        .append($('<option></option>')
          .attr('value', i.name)
          .text(i.name + ' (' + i.city + ')')); 
    }

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

    austin.push(nest[1]);
    dallas.push(nest[0]);
    houston.push(nest[2]);
    sanantonio.push(nest[3]);

    var austin = austin[0].values,
        dallas = dallas[0].values,
        houston = houston[0].values,
        sanantonio = sanantonio[0].values;

    var yValue, 
        yLabel,
        dataKey;

    dataKey = data;

    if (chart === 'atRisk') {
      yValue = function(d) { return d.atrisk; };
      yLabel = 'At Risk';   
    } else if (chart === 'ecoDis') {   
      yValue = function(d) { return d.ecodis; };
      yLabel = 'Economically Disadvantaged';
    } else if (chart === 'collegeReady') {
      yValue = function(d) { return d.collegeready; };
      yLabel = 'College Ready';
    }

    var xValue = function(d) { return d.enrolledpct;},
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        yMap = function(d) { return yScale(yValue(d));}; // data -> display

    // Call resize() on each chart
    d3.select(window).on('resize.' + chart, resize).transition();

    function dot(data) {
      var dots = svg.selectAll('.dot');
      dots.remove();

      console.log(dataKey);

      xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
      yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

      // draw dots
      svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 2)
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

    function resize() {
      console.log('triggered');
      width = parseInt(d3.select('.chart-container_scatter').style('width'), 10) - margin.left - margin.right;
      d3.select('#' + chart).select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      xScale.range([0, width]);
      xAxis = d3.svg.axis().scale(xScale).orient('bottom');

      svg.select('.x.axis').remove();
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis
          .scale(xScale)
          .orient('bottom')
          .ticks(10, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 28)
          .style('text-anchor', 'start')
          .text('Percent of Seniors Enrolled at UT-Austin');
          
      dot(dataKey);
    }  

    yScale.domain([0, 1]);

    // x-axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis
          .scale(xScale)
          .orient('bottom')
          .ticks(10, '%')
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
          .ticks(5, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', -(margin.left))
          .attr('x', 0)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Percent ' + yLabel);

    dot(dataKey);

    $('#all').click(function() {
      dot(data);
      dataKey = data;
    });

    $('#austin').click(function() {
      dot(austin);
      dataKey = austin;
    });

    $('#dallas').click(function() {
      dot(dallas);
      dataKey = dallas;
    });

    $('#houston').click(function() {
      dot(houston);
      dataKey = houston;
    });

    $('#sanantonio').click(function() {
      dot(sanantonio);
      dataKey = sanantonio;
    });

    $('#reset-highlights').click(function() {
      var highlight = svg.selectAll('.highlight');
          highlight.remove();

      $('#chosen-select').val('').trigger('chosen:updated');
      $('#chosen_enrolledpct').empty();
      $('#chosen_ecodis').empty();
      $('#chosen_collegeready').empty();
    });

    $('#chosen-select').change(function(d) {
      var name = $(this).val(),
          object = $.grep(data, function(e){ return e.name === name; }),
          enrolledpct = Math.round(object[0].enrolledpct * 100),
          ecodis = Math.round(object[0].ecodis * 100),
          collegeready = Math.round(object[0].collegeready * 100);

      $('#chosen_enrolledpct').html(enrolledpct + '%');
      $('#chosen_ecodis').html(ecodis + '%');
      $('#chosen_collegeready').html(collegeready + '%');

      var highlight = svg.selectAll('.highlight');
          highlight.remove();

      svg.selectAll('.highlight')
          .data(data)
          .enter().append('circle')
            .attr('class', 'highlight')
            .filter(function(d){ return d.name === name; })        // <== This line
            .style('fill', 'blue')                            // <== and this one
            .attr('r', 3)
            .attr('cx', xMap)
            .attr('cy', yMap);

    });
  });

});