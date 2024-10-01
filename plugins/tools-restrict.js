let handler = async (m, { conn, args, command, participants }) => {

    if (!args.length || !m.mentionedJid.length) {
        return conn.sendMessage(m.chat, {
            text: `💥🔴 *⚠️ ERROR ⚠️* 🔴💥\n\n🎯 *Parece que olvidaste mencionar a un usuario* 🎯\n\n🔗 _Usa_ *@usuario* _para aplicar, eliminar una advertencia o ver la lista de advertidos._`,
        });
    }

    const userId = m.mentionedJid[0];
    const reason = args.slice(1).join(' ') || 'sin especificar';

    if (!global.warn) global.warn = {};
    if (!global.warn[userId]) global.warn[userId] = 0;

    if (command === 'warn' || command === 'advertir') {
        global.warn[userId] += 1;

        if (global.warn[userId] >= 3) {
            await conn.sendMessage(m.chat, {
                text: `💀💣 *EXPULSIÓN INMINENTE* 💣💀\n\n🚫 @${userId.split('@')[0]} *ha alcanzado el límite de advertencias* 🚫\n\n📛 _Razón de la expulsión:_ _${reason}_\n\n⛔ *Se procederá con la expulsión inmediata del grupo.*`,
                mentions: [userId],
            });

            const kickMessage = await conn.sendMessage(m.chat, {
                text: `.kick @${userId.split('@')[0]}`,
                mentions: [userId],
            });

            setTimeout(() => {
                conn.modifyChat(m.chat, 'delete', {
                    id: kickMessage.key.id,
                    remoteJid: m.chat,
                    fromMe: true
                });
            }, 1000);

            await conn.sendMessage(userId, {
                text: `🚫 *EXPULSADO DEL GRUPO* 🚫\n\n⏰ _Has acumulado 3 advertencias en el grupo._\n\n⚠️ _Razón:_ *${reason}*\n\n💥 *Es importante seguir las normas!*`,
            });
            delete global.warn[userId];
            return;
        }

        await conn.sendMessage(m.chat, {
            text: `⚠️ *¡Advertencia!* ⚠️\n\n📛 @${userId.split('@')[0]}, *has recibido una advertencia* 📛\n\n📄 *Razón:* _${reason}_\n\n🔢 *Advertencias Totales:* ${global.warn[userId]}/3\n\n🚫 _A la tercera advertencia serás expulsado._`,
            mentions: [userId],
        });

    } else if (command === 'delwarn') {
        if (global.warn[userId] > 0) {
            global.warn[userId] -= 1;
            await conn.sendMessage(m.chat, {
                text: `✅ *Advertencia Eliminada* ✅\n\n📝 @${userId.split('@')[0]} *ahora tiene* ${global.warn[userId]} *advertencias restantes.*`,
                mentions: [userId],
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `❌ *Error* ❌\n\n@${userId.split('@')[0]} *no tiene advertencias registradas en este grupo.*`,
                mentions: [userId],
            });
        }

    } else if (command === 'listwarns') {

        let list = Object.keys(global.warn).map(jid => {
            return `🔸 @${jid.split('@')[0]}: ${global.warn[jid]} advertencias`;
        }).join('\n');

        if (!list) list = '📜 *No hay usuarios con advertencias en este grupo.* 🎉';

        await conn.sendMessage(m.chat, {
            text: `📋 *Lista de Advertencias del Grupo* 📋\n\n${list}`,
        });
    }
};

handler.command = /^(advertir|warn|delwarn|listwarns)$/i;
handler.tag = ['group'];
handler.admin = true;
handler.group = true;

export default handler;
