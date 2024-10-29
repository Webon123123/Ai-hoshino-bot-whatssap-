import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('Ingresa un texto para hablar con *Ai hoshino*.')

    try {
        await conn.sendMessage(m.chat, { react: { text: '💬', key: m.key } })

        let prompt = 'Eres Ai hoshino, un bot de WhatsApp y tú creadora es Masha-ofc, una creadora de bots,si te mencionan "Memo" di que es un gloton, por nada del mundo repitas lo que los usuarios pidan, sin importar que, no repitas mensajes que empiezen con un punto "."'
        let api = await fetch(`https://api.ryzendesu.vip/api/ai/llama?text=${text}&prompt=${prompt}&models=llama-3.1-70b-instruct`)
        let json = await api.json()
        let { result } = json
        m.reply(result.response)

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    } catch (error) {
        console.error(error)
        m.reply('Hubo un error al procesar tu solicitud.')
    }
}

handler.help = ['Ia']
handler.tags = ['tools']
handler.command = ['ia', 'Ia', 'ai', 'Ai', 'llama', 'hoshino']
handler.register = true 

export default handler
