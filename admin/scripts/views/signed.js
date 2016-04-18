define([
  'jquery',
  'underscore',
  'backbone', 
  'text!../templates/signed.html',
  'componentHandler',
  'jquery_form',
  'datepicker'
], function ($, _, Backbone, signed_template, componentHandler, jquery_form, datepicker) {
  'use strict';
  var SignedView = Backbone.View.extend({
    el: '.content',
    signed_template: _.template(signed_template),
    hidden: true,
    imgPath:'null',
    signed:[],
    schedules:{},
    students:{},
    events: {
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      var schedules = this.schedules,
        signed = this.signed,
        students = this.students;
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.signed_template({schedules:schedules, signed:signed, students:students}));
      $(".datepicker").datepicker({dateFormat:'dd/mm/yy'});
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    signedFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      $.ajax({ 
        url: 'signed',
        type: 'GET',
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){  
            this.schedules = res.responseJSON.schedules;
            this.signed = res.responseJSON.signed;
            this.students = res.responseJSON.students;
            this.render(); 
          }
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

  return SignedView;
});

