const { Plugin } = require('powercord/entities');
const endpoints = require('./endpoints');

// require sucks, just let me use import

module.exports = class NekosCord extends Plugin {
    startPlugin() {
        async function fetchNeko(neko) {
            let out;
            await fetch(`https://nekos.life/api/v2/img/${neko}`)
                .then((res) => res.json())
                .then((res) => {
                    out = res.url;
                });
            return out;
        }

        powercord.api.commands.registerCommand({
            command: 'neko',
            description: 'Get nekos from the Nekos.Life API',
            usage: '{c} [type]',
            executor: async (args) => {
                const type = endpoints[args[0]]?.hit;
                console.log(type);
                if (!type) {
                    return {
                        send: false,
                        result: {
                            type: 'rich',
                            author: { name: 'NekosCord' },
                            title: 'Invalid type specified',
                            description: `Please specify one of the following: ${Object.keys(
                                endpoints,
                            ).join(', ')}`,
                        },
                    };
                } else {
                    return {
                        send: true,
                        result: await fetchNeko(type),
                    };
                }
            },
        });
    }
};
