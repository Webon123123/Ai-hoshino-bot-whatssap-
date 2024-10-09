import Starlights from '@StarlightsTeam/Scraper'
let limit = 200 

let handler = async (m, { conn, text, isPrems, isOwner, usedPrefix, command }) => {
    if (!m.quoted) {
        await conn.reply(m.chat, `🚩 Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m)
        return m.react('✖️')
    }

    if (!m.quoted.text.includes("乂  Y O U T U B E  -  P L A Y")) {
        await conn.reply(m.chat, `🚩 Etiqueta el mensaje que contenga el resultado de YouTube Play.`, m)
        return m.react('✖️')
    }

    let urls = m.quoted.text.match(new RegExp(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/, 'gi'))
    if (!urls) {
        await conn.reply(m.chat, `Resultado no Encontrado.`, m)
        return m.react('✖️')
    }

    if (urls.length < text) {
        await conn.reply(m.chat, `Resultado no Encontrado.`, m)
        return m.react('✖️')
    }

    let user = global.db.data.users[m.sender] || {}

    await m.react('🕓') 
    try {
        let v = urls[0]
        let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp3(v)

        let sizeMB = parseFloat(size.split('MB')[0]) 
        if (sizeMB >= limit) {
            await conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m)
            return m.react('✖️')
        }

        await conn.sendFile(m.chat, dl_url, `${title}.mp3`, `*» Título* : ${title}\n*» Calidad* : ${quality}`, m, false, { mimetype: 'audio/mpeg', asDocument: user.useDocument })
        await m.react('✅') 
    } catch (err) {
        console.error(err)
        await conn.reply(m.chat, `Ocurrió un error durante la descarga.`, m)
        await m.react('✖️')
    }
}

handler.help = ['Audio']
handler.tags = ['downloader']
handler.customPrefix = /^(Audio|audio)$/i
handler.command = new RegExp

export default handler
