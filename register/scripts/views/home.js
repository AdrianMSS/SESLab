define([
  'jquery',
  'underscore',
  'backbone', 
  'scheduleCollection',
  'signedCollection',
  'text!../templates/home.html'
], function ($, _, Backbone, scheduleCollection, signedCollection, home_template) {
  'use strict';
  var ScheduleCollection = new scheduleCollection(),
    SignedCollection = new signedCollection(),
    HomeView = Backbone.View.extend({
    el: '.content',
    home_template: _.template(home_template),
    signedObj:{},
    schedulesObj:{},
    events: {
      'click #signStudent': 'signStudent'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.unbind();
    },

    render: function() { 
      var  student =  amplify.store('Student'),
        signed = this.signedObj;
      console.log(signed);
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.home_template({models:ScheduleCollection.models, signed:signed, student:student}));
      this.bind();
    },

    schedulesFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      ScheduleCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.signedFetch(that);
        },
        error: function(res){
        }
      })
    },

    signedFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      SignedCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.setSigned(that);
        },
        error: function(res){
        }
      })
    },

    setSigned: function(that){
      var signed = {},
        student =  amplify.store('Student')._id,
        schedules = {};
      _.each(ScheduleCollection.models, function(model){
        if(signed[model.attributes.type] === undefined){
          signed[model.attributes.type] = {};
          schedules[model.attributes.type] = {name:model.attributes.name};
          signed[model.attributes.type][model.attributes.date] = {};
          signed[model.attributes.type][model.attributes.date][model.attributes.hour] = {quantity:model.attributes.quantity, signed:0, checked:false};
        }
        else if(signed[model.attributes.type][model.attributes.date] === undefined){
          signed[model.attributes.type][model.attributes.date] = {};
          signed[model.attributes.type][model.attributes.date][model.attributes.hour] = {quantity:model.attributes.quantity, signed:0, checked:false};
        }
        else if(signed[model.attributes.type][model.attributes.date][model.attributes.hour] === undefined){
          signed[model.attributes.type][model.attributes.date][model.attributes.hour] = {quantity:model.attributes.quantity, signed:0, checked:false};
        }
      });
      _.each(SignedCollection.models, function(model){
        var state = (student === model.attributes.user);
        signed[model.attributes.type][model.attributes.date][model.attributes.hour].signed = signed[model.attributes.type][model.attributes.date][model.attributes.hour].signed+1;
        if(state){
          console.log(1);
          signed[model.attributes.type][model.attributes.date][model.attributes.hour].checked = true;
        }
      });
      that.signedObj = signed;
      that.schedulesObj = schedules;
      that.render();
    },

    signStudent: function(e){
      e.preventDefault();
      $('#homeDiv').addClass('loadingCursor');
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        signed = [],
        student =  amplify.store('Student')._id,
        mail =  amplify.store('Student').mail,
        schedules = this.schedulesObj,
        types = this.types;
      $('input[type="radio"]:checked').each(function() {
        signed.push(this.value);
      });
      $.ajax({ 
        url: 'schedule',
        type: 'POST',
        data: JSON.stringify({
          'student' : student,
          'signed' : signed,
          'schedules': schedules,
          'mail' : mail
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            alert('Matrícula Efectuada Correctamente, Confirmación Enviada al Correo.');
            this.schedulesFetch(this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    clear: function(e){
      this.$el.html('');
      this.unbind();
    }
  });

  return HomeView;
});

