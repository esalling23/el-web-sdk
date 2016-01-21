/**
 * Engagement Lab Website
 * 
 * Page category Model
 * @module listing
 * @class listing
 * @author Jay Vachon
 * 
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * @module listing
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Listing = new keystone.List('Listing', 
	{	
		hidden: true,
		sortable: true,
		autokey: { path: 'key', from: 'name', unique: true }
	});

/**
 * Local Methods
 * =============
 */
safeString = function(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(',', '');
};

/**
 * Model Fields
 * @main Listing
 */
Listing.add({
	name: { type: String, label: 'Name', required: true, initial: true, index: true },
	description: { type: String, label: 'Description', required: true, initial: true },

	image: { 
		type: Types.LocalFile, 
		label: 'Image',
		dest: './public/images/directory',
		prefix: '/directory',
		allowedTypes: ['image/png'],
		filename: function(item, file) {
			// Sanitize filename
			return 'listing_' + safeString(item.name) + '.' + file.extension;
		},
		format: function(item, file) {
			return '<img src="/images/directory/' + file.filename + '" alt="' + item.name + '">';
		}
	},

	createdAt: { type: Date, default: Date.now, noedit: true, hidden: true }
});

/**
 * Methods
 * =============
 */
Listing.schema.methods.safeName = function() {
    return safeString(this.name);
};

/**
 * Caching
 * =============
 */
Listing.schema.set('redisCache', true);
Listing.schema.set('expires', 60*60*24); // 24 hour caches

/**
 * Model Registration
 */
Listing.defaultSort  = 'sortOrder';
Listing.defaultColumns = 'name';
Listing.register();

exports = module.exports = Listing;