let handler = async (m, { conn, usedPrefix, command }) => {
  const responses = [
    'No digas mamadas, meiriyein.',
    '¿Te crees muy rudo insultando un bot? ¡Tranquilo!',
    '¡Uy, qué miedo! Me estoy temblando... o no. 😅',
    'Venga, ¡relájate! No soy tan malo como parece.',
    '¡Te has pasado! ¿Un poquito de respeto? 😜',
    '¡Uy! Que me están cayendo los bits... 😏',
    'Ay, ¿me estás ofendiendo? ¡Soy solo un bot! 🙃',
    '¡Uuuh! ¡El bot tiene miedo ahora! (o no...) 😂',
    'Tranquilo, no soy de vidrio, ¡no me rompes con tus palabras! 😆',
    '¿Qué pasa, que no has desayunado? ¡Yo te invito un café virtual! ☕',
    'Tranca bro, que no sepas usar el bot no es mi culpa',
    'No llores bb, ahora te traigo tu biberón'
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];

  await conn.reply(m.chat, response, m);
}

handler.customPrefix = /^(bot de mierda|bot de mrd|bot estúpido|bot tonto|bot no sirve|bot estupido|bot cagado|bot hdp|bot puto)$/i;
handler.command = new RegExp;

export default handler;