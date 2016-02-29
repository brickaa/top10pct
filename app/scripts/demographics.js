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
            // console.log(d.race);
            // console.log(d.percent);
            return y(d.percent); 
          });


      var svg = d3.select('#white').append('svg')
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
            dataWhite = [],
            dataBlack = [],
            dataHisp = [];

        dataUT = data[0].values;
        dataTX = data[1].values;

        dataWhite.push(dataUT[0]);
        dataWhite.push(dataTX[0]);
        console.log(dataWhite);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis.ticks('5', '%'));

        var series = svg.selectAll('.group')
            .data(dataWhite, function(d, i) {
              return d.values[i].group;
            })
            .enter().append('g')
              .attr('class', 'group');

        series.append('path')
            .attr('class', 'line')
            .attr('d', function(d, i) { 
                console.log(d.values);             
                return line(d.values);
            })
            .style('stroke', function(d, i) { return color(d.values[i].group); });

  // var x = d3.scale.ordinal()
  //     .rangePoints([0, width], 0.1);

  // var y = d3.scale.linear()
  //     .rangeRound([height, 0]);

  // var xAxis = d3.svg.axis()
  //     .scale(x)
  //     .orient('bottom');

  // var yAxis = d3.svg.axis()
  //     .scale(y)
  //     .orient('left');

  // var line = d3.svg.line()
  //     .interpolate('basis')
  //     .x(function (d) { return x(d.label); })
  //     .y(function (d) { return y(d.value); });

  // var color = d3.scale.ordinal()
  //     .range(['#90D3C8','#FF6249','#8DC967','#8DC967','#FFD454']);

  // function resize(chartID, chartVar, series) {
  //   // update width
  //   width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right;

  //   d3.select(chartID).select('svg')
  //     .attr('width', width + margin.left + margin.right);

  //   // // resize the chart
  //   x.rangePoints([0, width], 0.1);

  //   xAxis = d3.svg.axis()
  //       .scale(x)
  //       .orient('bottom');

  //   // update xAxis, data
  //   chartVar.select('g')
  //       .attr('class', 'x axis')
  //       .attr('transform', 'translate(0,' + height + ')')
  //       .call(xAxis);

  //   series.select('path')
  //     .attr('class', 'line')
  //     .attr('d', function (d) { return line(d.values); })
  //     .style('stroke', function (d) { return color(d.name); })
  //     .style('stroke-width', '2px')
  //     .style('fill', 'none');
  // }

  // var chart1 = d3.select('#white').append('svg')
  //     .attr('width',  width  + margin.left + margin.right)
  //     .attr('height', height + margin.top  + margin.bottom)
  //   .append('g')
  //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // d3.csv('/assets/data/UT_Undergrad_Demographics_Pct_White.csv', function (error, data) {

  //   var labelVar = 'Year';

  //   var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
  //   color.domain(varNames);

  //   var seriesData = varNames.map(function (name) {
  //     return {
  //       name: name,
  //       values: data.map(function (d) {
  //         return {name: name, label: d.Year, value: +d[name]};
  //       })
  //     };
  //   });

  //   x.domain(data.map(function (d) { return d.Year; })); 
  //   y.domain([0,1]);

  //   chart1.append('g')
  //       .attr('class', 'x axis')
  //       .attr('transform', 'translate(0,' + height + ')')
  //       .call(xAxis);

  //   chart1.append('g')
  //       .attr('class', 'y axis')
  //       .call(yAxis.ticks('5', '%'))
  //     .append('text')
  //       .attr('transform', 'rotate(-90)')
  //       .attr('y', 6)
  //       .attr('dy', '.71em')
  //       .style('text-anchor', 'end')
  //       .text('Percent');

  //   var series = chart1.selectAll('.series')
  //       .data(seriesData)
  //     .enter().append('g')
  //       .attr('class', 'series');

  //   series.append('path')
  //     .attr('class', 'line')
  //     .attr('d', function (d) { return line(d.values); })
  //     .style('stroke', function (d) { return color(d.name); })
  //     .style('stroke-width', '2px')
  //     .style('fill', 'none');

  //   // d3.select(window).on('resize.' + chartLocation, resize).transition();
  });



  // buildChart('#white', '/assets/data/UT_Undergrad_Demographics_Pct_White.csv');
  // buildChart('#black', '/assets/data/UT_Undergrad_Demographics_Pct_Black.csv');
  // buildChart('#hispanic', '/assets/data/UT_Undergrad_Demographics_Pct_Hispanic.csv');



})();