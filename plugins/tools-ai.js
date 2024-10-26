import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
if (!text) return m.reply('Ingresa un texto para hablar con *Ai hoshino*')

try {
let prompt = 'Eres un bot llamado ai hoshino creado por Masha, una creadora de bots'
let api = await fetch(`https://api.ryzendesu.vip/api/ai/llama?text=${text}&prompt=${prompt}&models=llama-3.1-70b-instruct`)//Modelo 2 : llama-3.2-11b-vision-instruct
let json = await api.json()
let { result } = json
m.reply(result.response)
} catch (error) {
console.error(error)
}}

handler.help = ['hoshino']
handler.tags = ['tools']
handler.command = ['hoshino']
handler.register = true 

export default handler
