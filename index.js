const data_matching = require('data-matching')
const parsip = require('parsip')
const jp = require('jsonpath')
const _ = require('lodash')

module.exports = (expected) => {
	var expected2 = data_matching.matchify_strings(expected)
	var f = (s, dict, throw_matching_error, path) => {
		var received = parsip.getSDP(s)
		return _.every(expected2, (val, key) => {
            var item = jp.query(received, key)
			if(val == data_matching.absent && item) {
				if(throw_matching_error) {
					throw Error(`key ${path}.${key} expected to be absent`)
				}
				return false
			}
			var full_match = false
			return data_matching.match(val, item, dict, full_match , throw_matching_error, `${path}.${key}`)
		})
	}
	f.__original_data__ = expected
	f.__name__ = 'sdp'
	return f
}
