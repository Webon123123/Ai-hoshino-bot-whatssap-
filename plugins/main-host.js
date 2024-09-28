import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {
let img = await (await fetch(`https://i.ibb.co/3N4StyG/file.jpg`)).buffer()
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
let txt = `🌐 *¡Bienvenidos a TK-HOST!* 🌐  

🔹 *Planes exclusivos desde $1 USD*  

🔹 ¡Precios imbatibles y calidad premium!  

🚀 *Consigue tu servidor hoy mismo* y lleva tu proyecto al siguiente nivel.  

🔗 [Únete aquí] y comienza con *TK-HOST*.

(https://chat.whatsapp.com/FmuetN8qqTx2vEVPmZLc6v) 

---

🌟 *No esperes más, únete a TK-HOST y disfruta de los mejores servidores.* 🌟

> 🚩 ${textbot}
> 🌟 ${canal}`
await conn.sendFile(m.chat, img, "Thumbnail.jpg", txt, m, null)
}
handler.help = ['host']
handler.tags = ['main']
handler.command = /^(host)$/i
export default handler
