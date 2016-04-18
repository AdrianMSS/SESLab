define ([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var SignedModel = Backbone.Model.extend({
		defaults:{
		}
	});

	return SignedModel;
});