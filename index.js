const data_matching = require('data-matching')
const jp = require('jsonpath')
const parse = require('sdp-parsing')
const _ = require('lodash')

const matcher = (expected) => {
    var expected2 = data_matching.matchify_strings(expected)
    var f = (s, dict, throw_matching_error, path) => {
        var received = parse(s)
        return _.every(expected2, (val, key) => {
            if(val == data_matching.absent && received[key]) {
                if(throw_matching_error) {
                    throw Error(`key ${path}.${key} expected to be absent`)
                }
                return false
            }
            var full_match = false
            return data_matching.match(val, received[key], dict, full_match , throw_matching_error, `${path}.${key}`)
        })
    }
    f.__original_data__ = expected
    f.__name__ = 'sdp'
    return f
}

const jsonpath_matcher = (expected) => {
    var expected2 = data_matching.matchify_strings(expected)
    var f = (s, dict, throw_matching_error, path) => {
        var received = parse(s)
        var keys = Object.keys(expected2)
        return keys.every(key => {
            var val = expected2[key]
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
    f.__name__ = 'sdp_jsonpath'
    return f
}

module.exports = {
    matcher,
    jsonpath_matcher,
}

