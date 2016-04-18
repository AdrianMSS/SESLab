define([
	'underscore',
	'backbone',
	'models/schedule'
], function (_, Backbone,ScheduleModel) {
	'use strict';

	var ScheduleCollection = Backbone.Collection.extend({
		model: ScheduleModel,
		url: '/inscripcion/schedule/'
	});

	return ScheduleCollection;
});