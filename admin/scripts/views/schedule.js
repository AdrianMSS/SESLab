define([
  'jquery',
  'underscore',
  'backbone', 
  'scheduleCollection',
  'text!../templates/schedule.html',
  'componentHandler',
  'jquery_form',
  'datepicker'
], function ($, _, Backbone, scheduleCollection, schedule_template, componentHandler, jquery_form, datepicker) {
  'use strict';
  var ScheduleCollection = new scheduleCollection(),
  ScheduleView = Backbone.View.extend({
    el: '.content',
    schedule_template: _.template(schedule_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveSchedule': 'saveSchedule',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteSchedule'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.schedule_template({models:ScheduleCollection.models}));
      $(".datepicker").datepicker({dateFormat:'dd/mm/yy'});
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    schedulesFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      ScheduleCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    saveSchedule: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        scheduleCode = $( '.scheduleCode' ).val(),
        scheduleName = $( '.scheduleName' ).val(),
        scheduleDescription = $( '.scheduleDescription' ).val(),
        scheduleType = parseInt($( '.scheduleType' ).val()),
        scheduleQuantity = parseInt($( '.scheduleQuantity' ).val()),
        scheduleDate = $( '#scheduleDate' ).val(),
        scheduleHour = parseInt($( '.scheduleHour' ).val()),
        scheduleTime = parseInt($( '.scheduleTime' ).val());
      $.ajax({ 
        url: 'schedule',
        type: 'POST',
        data: JSON.stringify({
          'code' : scheduleCode,
          'name' : scheduleName,
          'description' : scheduleDescription,
          'type' : scheduleType,
          'quantity' : scheduleQuantity,
          'date' : scheduleDate,
          'hour' : scheduleHour,
          'time' : scheduleTime
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.schedulesFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    saveEdit: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
      scheduleCode = $( '.'+e.currentTarget.value+'scheduleCode' ).val(),
      scheduleName = $( '.'+e.currentTarget.value+'scheduleName' ).val(),
      scheduleDescription = $( '.'+e.currentTarget.value+'scheduleDescription' ).val(),
      scheduleType = parseInt($( '.'+e.currentTarget.value+'scheduleType' ).val()),
      scheduleQuantity = parseInt($( '.'+e.currentTarget.value+'scheduleQuantity' ).val()),
      scheduleDate = $( '#'+e.currentTarget.value+'scheduleDate' ).val(),
      scheduleHour = parseInt($( '.'+e.currentTarget.value+'scheduleHour' ).val()),
      scheduleTime = parseInt($( '.'+e.currentTarget.value+'scheduleTime' ).val()),
      scheduleID = parseInt(e.currentTarget.id.split('I')[0]);
      $.ajax({ 
        url: 'schedule',
        type: 'PUT',
        data: JSON.stringify({
          'code' : scheduleCode,
          'name' : scheduleName,
          'description': scheduleDescription,
          'type': scheduleType,
          'quantity': scheduleQuantity,
          'date': scheduleDate,
          'hour': scheduleHour,
          '_id': scheduleID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.schedulesFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    deleteSchedule: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        scheduleID = parseInt(e.currentTarget.id.split('D')[0]);
      $.ajax({ 
        url: 'schedule',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': scheduleID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.schedulesFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    addHidden: function(idMsg) {
      this.hidden = true;
      $(idMsg).addClass('hidden');
    },

    clear: function(e){
      this.$el.html('');
      this.undelegateEvents();
    }
  });

  return ScheduleView;
});

