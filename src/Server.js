const dns = require('dns2');
const { port } = require('./Config');
const Resolver = require('./Resolver');
const Logger = require('./Logger');

class Server {
    static init() {
        Logger.info(`Listening on port ${port}`);
        this.server = dns.createServer(this.onRequest).listen(port);
    }

    static onRequest(req, cb) {
        Logger.info(`Got a request for ${url}`);

        const res = new dns.Packet(req);
        const { name, type } = req.questions[0];
        Resolver.resolve(name, type, (body) => {
            if (!body) return;
            res.header.qr = 1;
            res.header.ra = 1;

            try {
                if (body.Answer[0].type == 5) {
                    res.answers.push({
                        name: body.Answer[1].name,
                        type: body.Answer[1].type,
                        class: dns.Packet.CLASS.IN,
                        ttl: body.Answer[1].TTL,
                        address: body.Answer[1].data
                    });
                    cb(res);
                }
            } catch (e) {
                res.answers.push({
                    name,
                    type: body.Answer[0].type,
                    class: dns.Packet.CLASS.IN,
                    ttl: body.Answer[0].TTL,
                    address: body.Answer[0].data
                });
                cb(res);
            } finally {
                if (body.status == 3) {
                    res.answers.push({
                        name,
                        type: body.Authority[0].type,
                        class: dns.Packet.CLASS.IN,
                        ttl: body.Authority[0].TTL,
                        address: body.Authority[0].data
                    });
                    cb(res);
                }
            }
        });
    }
}

module.exports = Server;
