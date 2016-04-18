/*global define*/
define([
  'jquery',
  'backbone',
  'views/home',
  'views/login'
], function ($, Backbone, homeView, loginView) {
  'use strict';

  var HomeView = new homeView(),
    LoginView = new loginView(),
    nowView = undefined,
    Router = Backbone.Router.extend({
      routes: {
          '':     'check',
          'login': 'login',
          'logout': 'login',
          'home': 'home'
      },

      initialize: function() {
      },

      check: function(){
        var student =  amplify.store('Student');
        if(student){
          this.navigate('home', {trigger:true});
        }
        else this.navigate('login', {trigger:true});
      },

      home: function() {
        var  student =  amplify.store('Student');
        if(student){
          if(nowView){
            nowView.clear();
          }
          nowView = HomeView;
          HomeView.schedulesFetch(HomeView);
        }
        else this.navigate('login', {trigger:true});
      },

      /*entrance: function() {
        var  admin =  amplify.store('Grocer');
        if(admin){
          if(nowView){
            nowView.clear();
          }
          nowView = EntranceView;
          EntranceView.projectsFetch(EntranceView);
        }
        else this.navigate('login', {trigger:true});
      },*/

      login: function() {
          amplify.store('Student', null);
          if(nowView){
            nowView.clear();
          }
          nowView = LoginView;
          LoginView.render();
      }
  });
  return Router;
});


