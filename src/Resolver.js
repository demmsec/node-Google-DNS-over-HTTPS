const request = require('request');
const Logger = require('./Logger');

class Resolver {
    static resolve(url, type, cb) {
        const padding = this.generatePadding(1000 - url.length);
        request({
            url: 'https://dns.google.com/resolve',
            qs: {
                name: url,
                type,
                random_padding: padding
            }
        }, (err, { statusCode }, body) => {
            if (err || statusCode !== 200) {
                Logger.error(`Dns resolve failed for ${url}, error: ${err}, status code: ${statusCode}.`);
            }
            try {
                const parsedBody = JSON.parse(body);
                cb(parsedBody);
            } catch (e) {
                Logger.error(`Parsing of dns request failed for ${url}, error: ${e}`);
                cb(null);
            }
        });
    }

    static generatePadding(length) {
        return 'X'.repeat(length);
    }
}

module.exports = Resolver;
