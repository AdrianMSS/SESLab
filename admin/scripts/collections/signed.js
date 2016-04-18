define([
	'underscore',
	'backbone',
	'models/signed'
], function (_, Backbone,SignedModel) {
	'use strict';

	var SignedCollection = Backbone.Collection.extend({
		model: SignedModel,
		url: '/admin/signed/'
	});

	return SignedCollection;
});