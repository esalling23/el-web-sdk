/**
 * Engagement Lab Website
 * 
 * Person page parent Model
 * @module team
 * @author Johnny Richardson
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * @module team
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Person = new keystone.List('Person', 
															{
																label: 'People',
																singular: 'Team Member',
																sortable: true
															});

/**
 * Model Fields
 * @main Person
 */
Person.add({

	name: { type: Types.Name, label: 'Name', required: true, initial: true, index: true },
	title: { type: String, label: 'Title', required: true, initial: true },
	bio: { type: Types.Markdown, label: 'Bio', required: true, initial: true },
	image: { type: Types.CloudinaryImage, label: 'Image', folder: 'site/team' },	
  
  category: { type: Types.Select, options: 'directors, lab, assistants, fellows, advisors', default: 'directors', required: true, initial: true },
	
	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }

});

/**
 * Model Registration
 */
Person.defaultSort = '-sortOrder';
Person.defaultColumns = 'name, category';
Person.register();