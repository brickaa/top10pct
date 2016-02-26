// import './includes/adLoader';

/* global d3, $, Waypoint */

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
            return {name: name, label: d.Year, value: +d[name]};
          })
        };
      });

      console.log(seriesData);

      var line1 = [];
      var line2 = [];
      line1.push(seriesData[1]);
      line2.push(seriesData[0]);

      x.domain(data.map(function (d) { return d.Year; })); 
      y.domain([0,1]);

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
          .data(line1)
        .enter().append('g')
          .attr('class', 'series');

      series.append('path')
        .attr('class', 'line')
        .attr('d', function (d) { return line(d.values); })
        .style('stroke', function (d) { return color(d.name); })
        .style('stroke-width', '2px')
        .style('fill', 'none');

      var series2 = svg.selectAll('.series')
          .data(line2)
        .enter().append('g')
          .attr('class', 'series');

      series2.append('path')
        .attr('class', 'line')
        .attr('d', function (d) { return line(d.values); })
        .style('stroke', function (d) { return color(d.name); })
        .style('stroke-width', '2px')
        .style('fill', 'none');

      // d3.select(window).on('resize.' + chartLocation, resize).transition();
      function resize() {
        // update width
        width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right;

        d3.select(chartLocation).select('svg')
          .attr('width', width + margin.left + margin.right);

        // // resize the chart
        x.rangePoints([0, width], 0.1);

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
          .style('stroke', function (d) { return color(d.name); })
          .style('stroke-width', '2px')
          .style('fill', 'none');
   
      }

      function rescale() {   
        y.domain([0,
          d3.max(seriesData, function (c) { 
            return d3.max(c.values, function (d) { return d.value; });
          })
        ]);
        
        y.rangeRound([height, 0], 0.1);

        yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        // update yAxis, data
        svg.select('.y.axis')
            .transition().duration(1000).ease('sin-in-out')
            .call(yAxis.ticks('5', '%'));

        series.select('path')
          .transition().duration(1000)
          .attr('class', 'line')
          .attr('d', function (d) { return line(d.values); })
          .style('stroke', function (d) { return color(d.name); })
          .style('stroke-width', '2px')
          .style('fill', 'none');            
      }

      function rescaleAgain() {            
        y.domain([0,1]);
        
        y.rangeRound([height, 0], 0.1);

        yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        // update yAxis, data
        svg.select('.y.axis')
            .transition().duration(1000).ease('sin-in-out')
            .call(yAxis.ticks('5', '%'));

        series1.select('path')
          .transition().duration(1000)
          .attr('class', 'line')
          .attr('d', function (d) { return line(d.values); })
          .style('stroke', function (d) { return color(d.name); })
          .style('stroke-width', '2px')
          .style('fill', 'none');        
      }

      $('#rescale').click(function() {
        rescale();
      });

      $('#rescaleAgain').click(function() {
        rescaleAgain();
      });

      var sticky = new Waypoint.Sticky({
        element: $('.basic-sticky-example')[0]
      });

      var inview = new Waypoint.Inview({
        element: $('#waypoint1')[0],
        // context: document.getElementById('test-wrapper'),
        entered: function(direction) {
          if (direction === 'down') {
            $('#explainer1').fadeOut(500);
            $('#explainer2').delay(500).fadeIn(500);
            $('#explainer3').hide();
            $('#explainer4').hide();
            $('#explainer5').hide();

            // rescale();
          } else if (direction === 'up') {
            $('#explainer2').fadeOut(500);
            $('#explainer1').delay(500).fadeIn(500);
            $('#explainer3').hide();
            $('#explainer4').hide();
            $('#explainer5').hide();
            // rescaleAgain();
          }
        }
      });

      var inview2 = new Waypoint.Inview({
        element: $('#waypoint2')[0],
        // context: document.getElementById('test-wrapper'),
        entered: function(direction) {
          if (direction === 'down') {
            $('#explainer2').fadeOut(500);
            $('#explainer1').hide();
            $('#explainer3').delay(500).fadeIn(500);
            rescale();
          } else if (direction === 'up') {
            $('#explainer3').fadeOut(500);
            $('#explainer1').hide();
            $('#explainer2').delay(500).fadeIn(500);
            rescaleAgain();
          }
        }
      });
    });
  }

  buildChart('#white', '/assets/data/UT_Undergrad_Demographics_Pct_White.csv');
  buildChart('#black', '/assets/data/UT_Undergrad_Demographics_Pct_Black.csv');
  buildChart('#hispanic', '/assets/data/UT_Undergrad_Demographics_Pct_Hispanic.csv');



})();