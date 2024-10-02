let handler = async (m, { conn, text }) => {
  let user = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
  let fakeData = `
═══════ *SuperDOX* ═══════
👤 *Nombre*: Juan Perez
📅 *Fecha de Nacimiento*: 05/08/2000
📍 *Ubicación*: Lima, Perú
📞 *Número de teléfono*: +51 999 123 456
📧 *Correo*: juan.perez@gmail.com
🏡 *Dirección*: Av. Siempre Viva 742
💳 *Tarjeta de crédito*: 1234 5678 9101 1121
🔒 *Contraseña*: password123
═══════════════════════════
`;

  
  let msg = await conn.sendMessage(m.chat, { text: '🔍 *Iniciando superDOXEO...*\nPor favor espera...' }, { quoted: m });

  
  await delay(2000);
  await conn.sendMessage(m.chat, { text: '📡 *Obteniendo información del usuario...*\n📊 *Progreso*: 23%' }, { quoted: msg });

  await delay(2000);
  await conn.sendMessage(m.chat, { text: '📡 *Obteniendo información del usuario...*\n📊 *Progreso*: 47%' }, { quoted: msg });

  await delay(2000);
  await conn.sendMessage(m.chat, { text: '📦 *Procesando datos...*\n📊 *Progreso*: 68%' }, { quoted: msg });

  await delay(2000);
  await conn.sendMessage(m.chat, { text: '📦 *Procesando datos...*\n📊 *Progreso*: 89%' }, { quoted: msg });

  await delay(3000);
  await conn.sendMessage(m.chat, { text: `✅ *SuperDOXEO completado*\n${fakeData}` }, { quoted: msg });
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

handler.command = /^doxeo$/i;
handler.tag = ['fun']
handler.help = ['doxeo']

export default handler;
