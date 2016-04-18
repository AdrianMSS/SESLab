/*global define*/
define([
  'jquery',
  'backbone',
  'views/home',
  'views/schedule',
  'views/signed',
  'views/users'
], function ($, Backbone, homeView, scheduleView, signedView, usersView) {
  'use strict';

  var HomeView = new homeView(),
    ScheduleView = new scheduleView(),
    SignedView = new signedView(),
    UsersView = new usersView(),
    nowView = undefined,
    Router = Backbone.Router.extend({
      routes: {
          '':     'home',
          'home': 'home',
          'users': 'users',
          'schedule': 'schedule',
          'signed': 'signed'
      },

      initialize: function() {
        //NavbarView.clear();
        HomeView.clear();
        ScheduleView.clear();
      },

      home: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = HomeView;
        HomeView.render();
      },

      schedule: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = ScheduleView;
        ScheduleView.schedulesFetch(ScheduleView);
      },

      signed: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = SignedView;
        SignedView.signedFetch(SignedView);
      },

      users: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = UsersView;
        UsersView.usersFetch(UsersView);
      }
  });
  return Router;
});


