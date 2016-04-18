define([
	'underscore',
	'backbone',
	'models/users'
], function (_, Backbone,UsersModel) {
	'use strict';

	var UsersCollection = Backbone.Collection.extend({
		model: UsersModel,
		url: '/admin/users/'
	});

	return UsersCollection;
});