'use strict';

var cheerio = require('cheerio');
var http = require('http');

/**
 * Get ten most popular screen resolutions
 *
 * @param {Function} cb
 * @api public
 */

module.exports = function (cb) {
    var chunk = '';
    var ret = [];

    http.get('http://www.w3counter.com/globalstats.php', function (res) {
        if (res.statusCode !== 200) {
            cb('Error code ' + res.statusCode);
        }

        res.on('data', function (data) {
            chunk += data;
        });

        res.on('end', function () {
            var $ = cheerio.load(chunk);

            $('th').filter(function () {
                return this.text() === 'Screen Resolutions';
            }).parent().nextAll('.item').each(function () {
                ret.push(this.text());
            });

            cb(null, ret);
        });
    }).on('error', function (err) {
        cb(err);
    });
};
