// import './includes/adLoader';

/* global d3, $ */

(function() {
  'use strict';

  function buildChart(chartLocation, dataSource) {
    var margin = {top: 20, right: 20, bottom: 30, left: 60},
        width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var line = d3.svg.line()
        .interpolate('cardinal')
        .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
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
        .style('stroke-width', '4px')
        .style('fill', 'none')

      series.selectAll('.point')
        .data(function (d) { return d.values; })
        .enter().append('circle')
         .attr('class', 'point')
         .attr('cx', function (d) { return x(d.label) + x.rangeBand()/2; })
         .attr('cy', function (d) { return y(d.value); })
         .attr('r', '5px')
         .style('fill', function (d) { return color(d.name); })
         .style('stroke', 'grey')
         .style('stroke-width', '2px')
         .on('mouseover', function (d) { showPopover.call(this, d); })
         .on('mouseout',  function (d) { removePopovers(); })

      var legend = svg.selectAll('.legend')
          .data(varNames.slice().reverse())
        .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', function (d, i) { return 'translate(55,' + i * 20 + ')'; });

      legend.append('rect')
          .attr('x', width - 10)
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', color)
          .style('stroke', 'grey');

      legend.append('text')
          .attr('x', width - 12)
          .attr('y', 6)
          .attr('dy', '.35em')
          .style('text-anchor', 'end')
          .text(function (d) { return d; });

      function removePopovers () {
        $('.popover').each(function() {
          $(this).remove();
        }); 
      }

      function showPopover (d) {
        $(this).popover({
          title: d.name,
          placement: 'auto top',
          container: 'chartLocation',
          trigger: 'manual',
          html : true,
          content: function() { 
            return 'Year: ' + d.label + 
                   '<br/>Rounds: ' + d3.format(',')(d.value ? d.value: d.y1 - d.y0); }
        });
        $(this).popover('show')
      }

      d3.select(window).on('resize.' + location, resize).transition();
      
      function resize() {
          // update width
          width = parseInt(d3.select('.chart-container').style('width'), 10);
          width = width - margin.left - margin.right;

          d3.select('#' + location).select('svg')
            .attr('width', width + margin.left + margin.right);
   
      }
    });
  }

  buildChart('#white', '/assets/data/UT_Undergrad_Demographics_Pct_White.csv');
  buildChart('#black', '/assets/data/UT_Undergrad_Demographics_Pct_Black.csv');

})();