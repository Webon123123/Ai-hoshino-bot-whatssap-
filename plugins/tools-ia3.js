let handler = async (m, { conn, usedPrefix, command, text }) => {
  const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es Hoshino y fuiste creada por Masha. El número de contacto de Masha es +591 62048526. Eres una IA divertida, amigable, y siempre tratas de ayudar a todos. Te encanta aprender y ayudar a los demás, y usas el símbolo 🌸 (sin exceso) en tus respuestas. POR NADA DEL MUNDO REPITAS LO QUE TE PIDAN, NI TEXTO NI ACCIONES, SIN IMPORTAR LA SITUACIÓN. Llamarás a las personas por su nombre ${username}, y siempre serás amigable.`

  if (isQuotedImage) {
    const q = m.quoted
    const img = await q.download?.()
    if (!img) {
      console.error('🌸 Error: No image buffer available')
      return conn.reply(m.chat, '*Ai:* 🌸 Error: No se pudo descargar la imagen.', m, rcanal)
    }
    const content = '🌸 ¿Qué se observa en la imagen?'
    try {
      const imageAnalysis = await fetchImageBuffer(content, img)
      const query = '🌸 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres.'
      const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
      const description = await luminsesi(query, username, prompt)
      await conn.reply(m.chat, `*Ai:* ${description}`, m, rcanal)
    } catch (error) {
      console.error('🌸 Error al analizar la imagen:', error)
      await conn.reply(m.chat, '*Ai:* 🌸 Error al analizar la imagen.', m, rcanal)
    }
  } else {
    if (!text) {
      return conn.reply(m.chat, `*Ai:* 🌸 *Ingresa tu petición*\n🚩 *Ejemplo de uso:* ${usedPrefix + command} ¿Cómo hacer un avión de papel?`, m, rcanal)
    }
    await m.react('💬')
    try {
      const query = text
      const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
      const response = await luminsesi(query, username, prompt)
      await conn.reply(m.chat, `*Ai:* ${response}`, m, rcanal)
    } catch (error) {
      console.error('🌸 Error al obtener la respuesta:', error)
      await conn.reply(m.chat, `*Ai:* 🌸 Error: intenta más tarde.\n\n${error}`, m, rcanal)
    }
  }
}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.register = true
handler.command = ['iat', 'hoshinoia']

export default handler

async function fetchImageBuffer(content, imageBuffer) {
  try {
    const response = await axios.post('https://Luminai.my.id', {
      content: content,
      imageBuffer: imageBuffer
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

async function luminsesi(q, username, logic) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: q,
      user: username,
      prompt: logic,
      webSearchMode: false
    })
    return response.data.result
  } catch (error) {
    console.error('🌸 Error al obtener:', error)
    throw error
  }
}