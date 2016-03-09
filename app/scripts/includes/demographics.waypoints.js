/* global $ */

var text1 = $('#explainer1');
var text2 = $('#explainer2');
var text3 = $('#explainer3');
var text4 = $('#explainer4');
var text5 = $('#explainer5');

var pos1 = $('#explainerPos1');
var pos2 = $('#explainerPos2');
var pos3 = $('#explainerPos3');
var pos4 = $('#explainerPos4');
var pos5 = $('#explainerPos5');

pos1.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint1').offset().top }, 500);
});

pos2.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint2').offset().top - 500 }, 500);
});

pos3.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint3').offset().top - 500 }, 500);
});

pos4.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint4').offset().top - 500 }, 500);
});

pos5.click(function() {
  $('body, html').animate({ scrollTop: $('#waypoint5').offset().top - 500 }, 500);
});

var sticky = new Waypoint.Sticky({
  element: $('.sticky-charts')[0]
});

var inview6 = new Waypoint.Inview({
  element: $('#waypoint6')[0],
  enter: function(direction) {
    if (direction === 'down') {
      $('.sticky-charts').removeClass('stuck');
      $('.chart-wrapper').css('position', 'absolute');
      $('.chart-wrapper').css('bottom', 0);
    }  
  },
  exit: function(direction) {
    if (direction === 'up') {
      $('.sticky-charts').addClass('stuck');
      $('.chart-wrapper').css('position', 'relative');
      $('.chart-wrapper').css('bottom', '');
    }
  }
});

var inview1 = new Waypoint.Inview({
  element: $('#waypoint1')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text1.animate({ opacity: 1});
      pos1.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_tx').animate({ opacity: 1});
      $('.chart--header').animate({ opacity: 1});
    } 
  },
  exit: function(direction) {
    if (direction === 'up') {
      text1.animate({ opacity: 0});
      pos1.removeClass('fa-circle').addClass('fa-circle-thin');
      $('.legend_tx').animate({ opacity: 0});
      $('.chart--header').animate({ opacity: 0});
    }
  }
});

var inview2 = new Waypoint.Inview({
  element: $('#waypoint2')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text1.animate({ opacity: 0});
      text2.animate({ opacity: 1});
      pos1.removeClass('fa-circle').addClass('fa-circle-thin');
      pos2.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 1});
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text1.animate({ opacity: 1});
      text2.animate({ opacity: 0});
      pos2.removeClass('fa-circle').addClass('fa-circle-thin');
      pos1.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 0});
    }
  }
});

var inview3 = new Waypoint.Inview({
  element: $('#waypoint3')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text2.animate({ opacity: 0});
      text3.animate({ opacity: 1});
      pos2.removeClass('fa-circle').addClass('fa-circle-thin');
      pos3.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 0});
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text2.animate({ opacity: 1});
      text3.animate({ opacity: 0});
      pos3.removeClass('fa-circle').addClass('fa-circle-thin');
      pos2.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 1});
    }
  }
});

var inview4 = new Waypoint.Inview({
  element: $('#waypoint4')[0],
  enter: function(direction) {
    if (direction === 'down') {
      text3.animate({ opacity: 0});
      text4.animate({ opacity: 1});
      pos3.removeClass('fa-circle').addClass('fa-circle-thin');
      pos4.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 1});
    }
  },
  exit: function(direction) {
    if (direction === 'up') {
      text3.animate({ opacity: 1});
      text4.animate({ opacity: 0});
      pos4.removeClass('fa-circle').addClass('fa-circle-thin');
      pos3.removeClass('fa-circle-thin').addClass('fa-circle');
      $('.legend_ut').animate({ opacity: 0});
    }
  }
});

// var inview5 = new Waypoint.Inview({
//   element: $('#waypoint5')[0],
//   enter: function(direction) {
//     if (direction === 'down') {
//       text4.animate({ opacity: 0});
//       text5.animate({ opacity: 1});
//       pos4.removeClass('fa-circle').addClass('fa-circle-thin');
//       pos5.removeClass('fa-circle-thin').addClass('fa-circle');
//     }
//   },
//   exit: function(direction) {
//     if (direction === 'up') {
//       text4.animate({ opacity: 1});
//       text5.animate({ opacity: 0});
//       pos5.removeClass('fa-circle').addClass('fa-circle-thin');
//       pos4.removeClass('fa-circle-thin').addClass('fa-circle');
//     }
//   }
// });