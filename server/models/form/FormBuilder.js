/* Require mongoose to interact with mongoDB */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * This will be the Schema for the Form Builder Documents.
 **/
var formBuilderScheme = mongoose.Schema({
    color: {type: String, required: true},
    first_name: {type: Boolean, required: true},
    last_name: {type: Boolean, required: true},
    phone_number: {type: Boolean, required: true},
    optional_1: {type: Array, required: true},
    optional_2: {type: Array, required: true},
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true }
});

module.exports = mongoose.model('FormBuilder', formBuilderScheme);
