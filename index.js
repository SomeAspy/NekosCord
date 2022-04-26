const { Plugin } = require('powercord/entities');
const endpoints = require('./endpoints');
const { Settings } = require('./settings.jsx');

// require sucks, just let me use import

module.exports = class NekosCord extends Plugin {
    startPlugin() {
        powercord.api.settings.registerSettings('nekoscord', {
            category: this.entityID,
            label: 'NekosCord',
            render: Settings,
        });

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
                }
                if (this.settings.get('nsfw') && type?.nsfw) {
                    return {
                        send: false,
                        result: {
                            type: 'rich',
                            author: { name: 'NekosCord' },
                            title: 'NSFW is disabled',
                            description:
                                'This type is NSFW, you may enable NSFW in the settings',
                        },
                    };
                }
                return {
                    send: true,
                    result: await fetchNeko(type),
                };
            },
        });
    }
};
