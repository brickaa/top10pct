// import './includes/adLoader';

/* global d3, $, Waypoint */

(function() {
  'use strict';

  var margin = {top: 20, right: 20, bottom: 30, left: 60},
      width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
      
      var parseDate = d3.time.format('%Y%m%d').parse;

      var x = d3.time.scale()
          .range([0,width]);
          
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
        var svg = d3.select('#' + race).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      
        d3.csv('/assets/data/data.csv', function(error, data) {

          var color = d3.scale.ordinal().range(['#90D3C8','#FF6249','#8DC967','#8DC967','#FFD454']);
              
        // first we need to corerce the data into the right formats
          data = data.map( function (d) { 
            return { 
              group: d.group,
              race: d.race,
              date: parseDate(d.date),
              percent: +d.percent }; 
          });   
          
        // then we need to nest the data on group since we want to only draw one
        // line per group
          data = d3.nest().key(function(d) { return d.group; }).key(function(d) { return d.race; }).entries(data);

          x.domain([d3.min(data, function(d, i) { return d3.min(d.values[i].values, function (d) { return d.date; }); }),
                     d3.max(data, function(d, i) { return d3.max(d.values[i].values, function (d) { return d.date; }); })]);
          y.domain([0,1]);

          var dataUT = [],
              dataTX = [],
              dataRace = [];

          dataUT = data[0].values;
          dataTX = data[1].values;

          dataRace.push(dataUT[index]);
          dataRace.push(dataTX[index]);

          svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

          svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis.ticks('5', '%'));

          var series = svg.selectAll('.group')
              .data(dataRace, function(d, i) {
                return d.values[i].group;
              })
              .enter().append('g')
                .attr('class', 'group');

          series.append('path')
              .attr('class', 'line')
              .attr('d', function(d, i) { 
                  return line(d.values);
              })
              .style('stroke', function(d, i) { return color(d.values[i].group); });

          d3.select(window).on('resize.' + race, resize).transition();

          function resize() {
            // update width
            width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right;

            d3.select('#' + race).select('svg')
              .attr('width', width + margin.left + margin.right);

            // // resize the chart
            x.range([0,width]);

            xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            // update xAxis, data
            svg.select('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            series.select('path')
              .attr('class', 'line')
              .attr('d', function (d) { return line(d.values); })
              .style('stroke', function(d, i) { return color(d.values[i].group); })
              .style('stroke-width', '2px')
              .style('fill', 'none');
          }
      });

  });


})();