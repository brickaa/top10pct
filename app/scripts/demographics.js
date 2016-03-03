// import './includes/adLoader';

/* global d3, $, Waypoint */

(function() {
  'use strict';

  var margin = {top: 20, right: 20, bottom: 30, left: 60},
      width = parseInt(d3.select('.chart-container').style('width'), 10) - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
      
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
          
          var yDomain;

          y.domain([0,1]);

          var dataUT = [],
              dataTX = [],
              dataRace = [];

          dataUT = data[0].values;
          dataTX = data[1].values;

          dataRace.push(dataTX[index]);

          // svg.append('g')
          //     .attr('class', 'x axis')
          //     .attr('transform', 'translate(0,' + height + ')')
          //     .call(xAxis);

          svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis.ticks('5', '%'));

          svg.selectAll('.bar')
            .data(dataRace, function(d) {
              return d.values[0].group;
            })
            .enter().append('rect')
              .attr('class', 'bar')
              .attr('x', function(d, i) { return x(d.values[i].date) + (width/4 * (i) + 4); })
              .attr('width', width/4)
              .attr('y', function(d, i) { return y(d.values[i].percent); })
              .attr('height', function(d, i) { return y(0) - y(d.values[i].percent); })
              .attr('fill', function(d, i) { return color(d.values[i].group); });

          d3.select(window).on('resize.' + race, resize).transition();

          function addUTBar() {
            dataRace.push(dataUT[index]);

            svg.selectAll('.bar')
              .data(dataRace, function(d) {
                return d.values[1].group;
              })
              .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function(d, i) { return x(d.values[i].date) + ((width/4) * (i) + 4); })
                .attr('width', width/4)
                .attr('y', function(d, i) { return y(d.values[i].percent); })
                .attr('height', function(d, i) { return y(0) - y(d.values[i].percent); })
                .attr('fill', function(d, i) { return color(d.values[i].group); });

          }

          function addTXLine() {

            if(yDomain && yDomain === 1) {
              resetScale();
            } else if (yDomain) {
              rescale();
            }

            var series = svg.selectAll('.group')
                .data(dataRace, function(d, i) {
                  return d.values[i].group;
                })
                .enter().append('g')
                  .attr('class', 'group');

            series.append('path')
                .attr('class', 'line')
                .attr('d', function(d) { 
                    return line(d.values);
                })
                .style('stroke', function(d, i) { return color(d.values[i].group); });


          }

          function addUT() {
            dataRace.push(dataUT[index]);

            if(yDomain && yDomain === 1) {
              resetScale();
            } else if (yDomain) {
              rescale();
            }

            var series = svg.selectAll('.group')
                .data(dataRace, function(d, i) {
                  return d.values[i].group;
                })
                .enter().append('g')
                  .attr('class', 'group');

            series.append('path')
                .attr('class', 'line')
                .attr('d', function(d) { 
                    return line(d.values);
                })
                .style('stroke', function(d, i) { return color(d.values[i].group); });
          }

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
            // svg.select('g')
            //   .attr('class', 'x axis')
            //   .attr('transform', 'translate(0,' + height + ')')
            //   .call(xAxis);

            var series = svg.selectAll('.group');

            series.select('path')
              .attr('class', 'line')
              .attr('d', function(d) { 
                  return line(d.values);
              })
              .style('stroke', function(d, i) { return color(d.values[i].group); });
          
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

            series.select('path')
              .transition().duration(1000)
              .attr('class', 'line')
              .attr('d', function(d) { 
                  return line(d.values);
              })
              .style('stroke', function(d, i) { return color(d.values[i].group); });         
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

            series.select('path')
              .transition().duration(1000)
              .attr('class', 'line')
              .attr('d', function(d) { 
                  return line(d.values);
              })
              .style('stroke', function(d, i) { return color(d.values[i].group); });          
          }

          var inview2 = new Waypoint.Inview({
            element: $('#waypoint2')[0],
            exit: function(direction) {
              if (direction === 'down') {
                addUTBar();
              } else if (direction === 'up') {
              }
            }
          });

        $('#rescale').click(function() {
          rescale();
        });

        $('#reset').click(function() {
          resetScale();
        });

        $('#addUT').click(function() {
          addUT();
        });
      });

  });

  var text1 = $('#explainer1');
  var text2 = $('#explainer2');
  var text3 = $('#explainer3');
  var text4 = $('#explainer4');
  var text5 = $('#explainer5');

  var sticky = new Waypoint.Sticky({
    element: $('.basic-sticky-example')[0]
  });

  var inview = new Waypoint.Inview({
    element: $('#waypoint1')[0],
    exit: function(direction) {
      if (direction === 'down') {
        text1.animate({ opacity: 1});
      } else if (direction === 'up') {
        text1.animate({ opacity: 0});
      }
    }
  });

  var inview2 = new Waypoint.Inview({
    element: $('#waypoint2')[0],
    exit: function(direction) {
      if (direction === 'down') {
        text1.animate({ opacity: 0});
        text2.animate({ opacity: 1});
        console.log('exit 2');
        $('.legend_ut').animate({ opacity: 1 });
      } else if (direction === 'up') {
        text1.animate({ opacity: 1});
        text2.animate({ opacity: 0});
      }
    }
  });
})();