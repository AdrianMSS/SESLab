define([
  'jquery',
  'underscore',
  'backbone', 
  'usersCollection',
  'text!../templates/users.html',
  'componentHandler',
  'jquery_form'
], function ($, _, Backbone, usersCollection, users_template, componentHandler, jquery_form) {
  'use strict';
  var UsersCollection = new usersCollection(),
  UsersView = Backbone.View.extend({
    el: '.content',
    users_template: _.template(users_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveUser': 'saveUser',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteUsers'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.users_template({models:UsersCollection.models}));
      $(".datepicker").datepicker({dateFormat:'dd/mm/yy'});
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    usersFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      UsersCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    saveUser: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        userName = $( '.userName' ).val(),
        userMail = $( '.userMail' ).val();
      $.ajax({ 
        url: 'users',
        type: 'POST',
        data: JSON.stringify({
          'name' : userName,
          'mail' : userMail
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.usersFetch, 500, this); 
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

    deleteUsers: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        scheduleID = parseInt(e.currentTarget.id.split('D')[0]);
      $.ajax({ 
        url: 'users',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': scheduleID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.usersFetch, 500, this); 
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

  return UsersView;
});

