// import './includes/adLoader';

/* global d3, $ */

(function() {
  'use strict';

  function buildChart(chartLocation, dataSource) {
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangePoints([0, width], 0.1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.label); })
        .y(function (d) { return y(d.value); });

    var color = d3.scale.ordinal()
        .range(['#90D3C8','#FF6249','#8DC967','#8DC967','#FFD454']);

    var svg = d3.select(chartLocation).append('svg')
        .attr('width',  width  + margin.left + margin.right)
        .attr('height', height + margin.top  + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv(dataSource, function (error, data) {

      var labelVar = 'Year';
      var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
      color.domain(varNames);

      var seriesData = varNames.map(function (name) {
        return {
          name: name,
          values: data.map(function (d) {
            return {name: name, label: d[labelVar], value: +d[name]};
          })
        };
      });

      x.domain(data.map(function (d) { return d.Year; }));
      y.domain([
        d3.min(seriesData, function (c) { 
          return d3.min(c.values, function (d) { return d.value; });
        }),
        d3.max(seriesData, function (c) { 
          return d3.max(c.values, function (d) { return d.value; });
        })
      ]);

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis.ticks('5', '%'))
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Percent');

      var series = svg.selectAll('.series')
          .data(seriesData)
        .enter().append('g')
          .attr('class', 'series');

      series.append('path')
        .attr('class', 'line')
        .attr('d', function (d) { return line(d.values); })
        .style('stroke', function (d) { return color(d.name); })
        .style('stroke-width', '2px')
        .style('fill', 'none');

      series.selectAll('.point')
        .data(function (d) { return d.values; });

      // var legend = svg.selectAll('.legend')
      //     .data(varNames.slice().reverse())
      //   .enter().append('g')
      //     .attr('class', 'legend')
      //     .attr('transform', function (d, i) { return 'translate(55,' + i * 20 + ')'; });

      // legend.append('rect')
      //     .attr('x', width - 10)
      //     .attr('width', 10)
      //     .attr('height', 10)
      //     .style('fill', color)
      //     .style('stroke', 'grey');

      // legend.append('text')
      //     .attr('x', width - 12)
      //     .attr('y', 6)
      //     .attr('dy', '.35em')
      //     .style('text-anchor', 'end')
      //     .text(function (d) { return d; });

      d3.select(window).on('resize.' + chartLocation, resize).transition();

      function resize() {
          console.log('resize');
          // update width
          width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right;

          d3.select(chartLocation).select('svg')
            .attr('width', width + margin.left + margin.right);

          // // resize the chart
          x.rangePoints([0, width], 0.1);

          xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

          // xScale.range([0, width]);
          // xMap = function(d) { return xScale(xValue(d));}; // data -> display
          // xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          // // update axes

          svg.select('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

          series.select('path')
            .attr('class', 'line')
            .attr('d', function (d) { return line(d.values); })
            .style('stroke', function (d) { return color(d.name); })
            .style('stroke-width', '2px')
            .style('fill', 'none');
          // svg.select('g')
          //   .attr('class', 'x axis')
          //   .attr('transform', 'translate(0,' + height + ')')
          //   .call(xAxis
          //     .scale(xScale)
          //     .orient('bottom')
          //     .ticks(5, '%'));

          // svg.selectAll('.dot')
          //   .attr('class', 'dot')
          //   .attr('cx', xMap);
   
      }
    });
  }

  buildChart('#white', '/assets/data/UT_Undergrad_Demographics_Pct_White.csv');
  buildChart('#black', '/assets/data/UT_Undergrad_Demographics_Pct_Black.csv');
  buildChart('#hispanic', '/assets/data/UT_Undergrad_Demographics_Pct_Hispanic.csv');

})();