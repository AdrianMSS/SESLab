define([
  'jquery',
  'underscore',
  'backbone', 
  'amplify',
  'text!../templates/login.html',
  'componentHandler'
], function ($, _, Backbone, amplify, login_template, componentHandler) {
  'use strict';
  var LoginView = Backbone.View.extend({
    el: '.content',
    login_template: _.template(login_template),

    events: {
      'click #login_button': 'login'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.login_template()); 
      this.delegateEvents();
      componentHandler.upgradeDom();
    },

    login: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        emailLogin = $( '#email' ).val();
      $.ajax({ 
        url: 'login',
        type: 'POST',
        data: JSON.stringify({
          'mail' : emailLogin
        }),
        beforeSend : setHeader,
        complete: function(res){
          switch(res.status){
            case 200:
              var student = res.responseJSON;
              amplify.store('Student', student);
              window.location.replace('#home');
              break;
            case 500:
              $('#modalerrorFound').removeClass('hidden');
              setTimeout(this.addHidden, 3000, '#modalerrorFound'); 
              break;
            default:
              alert('Error');
              console.log(eval('(' + res.responseText + ')'));
              break;
          }
        }.bind(this)
      });
    },

    addHidden: function(idMsg) {
      $(idMsg).addClass('hidden');
    },

    clear: function(e){
      this.$el.html('');
      this.undelegateEvents();
    }
  });

  return LoginView;
});

