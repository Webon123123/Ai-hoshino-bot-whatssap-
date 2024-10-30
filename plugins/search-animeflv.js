import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let animeSearchHandler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('🚩 Por favor, ingresa el nombre del anime que deseas buscar.');
    }

    try {
        async function createImageMessage(url) {
            const defaultImageUrl = 'https://i.ibb.co/hcnfCQS/file.jpg';
            const { imageMessage } = await generateWAMessageContent({ image: { url: url || defaultImageUrl } }, { upload: conn.waUploadToServer });
            return imageMessage;
        }

        let resultsArray = [];
        const response = await fetch(`https://animeflvapi.vercel.app/search?text=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return conn.reply(m.chat, '🚩 No se encontraron animes con ese nombre.', m);
        }

        for (let anime of data.results) {
            const animeId = anime.id;
            const animeTitle = anime.title || 'Título no disponible';
            const animeScore = anime.score ? `⭐ **Rating**: ${anime.score}` : '⭐ **Rating**: No disponible';
            const animePoster = anime.poster || 'https://i.ibb.co/hcnfCQS/file.jpg';
            const imageMessage = await createImageMessage(animePoster);

            resultsArray.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `✨🌌 **Título**: ${animeTitle}\n💫💖 ${animeScore} 💖💫`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `🆔 **ID**: ${animeId}`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: imageMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_copy",
                        buttonParamsJson: `{"display_text":"Copiar ID","id":"${animeId}","copy_code":"${animeId}"}`
                    }]
                })
            });
        }

        const message = generateWAMessageFromContent(m.chat, {
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
                            cards: [...resultsArray]
                        })
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });

    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `🚩 Error: ${error.message}`, m);
    }
};

animeSearchHandler.help = ["animesearch"];
animeSearchHandler.tags = ["search"];
animeSearchHandler.command = /^(searchanime|animeflv|animesearch|animeid)$/i;
export default animeSearchHandler;
