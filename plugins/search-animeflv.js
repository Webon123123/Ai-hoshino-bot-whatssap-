import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let _0x1a2b3c = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('🚩 Por favor, ingresa el nombre del anime que deseas buscar.');
    }

    try {
        async function _0x4d5e6f(url) {
            const _0x7g8h9i = url || 'https://i.ibb.co/hcnfCQS/file.jpg';
            const { imageMessage } = await generateWAMessageContent({ image: { url: _0x7g8h9i } }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        let _0x10e11f = [];
        const _0x12a13b = await fetch(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
        const _0x14c15d = await _0x12a13b.json();

        if (!_0x14c15d.results || _0x14c15d.results.length === 0) {
            return conn.reply(m.chat, '🚩 No se encontraron animes con ese nombre.', m);
        }

        for (let _0x16e17f of _0x14c15d.results) {
            const _0x181920 = _0x16e17f.id;
            const _0x212223 = _0x16e17f.title || 'Título no disponible';
            const _0x242526 = _0x16e17f.score ? `⭐ **Rating**: ${_0x16e17f.score}` : '⭐ **Rating**: No disponible';
            const _0x272829 = _0x16e17f.poster || 'https://i.ibb.co/hcnfCQS/file.jpg';
            const _0x303132 = await _0x4d5e6f(_0x272829);

            _0x10e11f.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `✨🌌 **Título**: ${_0x212223}\n💫💖 ${_0x242526} 💖💫`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `🆔 **ID**: ${_0x181920}`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: _0x303132
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_copy",
                        buttonParamsJson: `{"display_text":"Copiar ID","id":"${_0x181920}","copy_code":"${_0x181920}"}`
                    }]
                })
            });
        }

        const _0x333435 = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `✨✨✨ Resultados para: ${text} ✨✨✨`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: '🌌✨ Aquí están tus resultados. 🌌✨\n\n👤 ' + String.fromCharCode(77, 97, 115, 104, 97, 32, 79, 70, 67)
                        }),
                        header: proto.Message.InteractiveMessage.Header.create({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [..._0x10e11f]
                        })
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, _0x333435.message, { messageId: _0x333435.key.id });

    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

_handler.help = ["animesearch"];
_handler.tags = ["search"];
_handler.command = /^(searchanime|animeflv|animesearch|animeid)$/i;
export default _0x1a2b3c;
