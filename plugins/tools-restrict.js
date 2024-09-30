let handler = async (m, { conn, args, command, participants }) => {

    

    if (!args.length || !m.mentionedJid.length) {

        return conn.sendMessage(m.chat, {

            text: `🚨 *Atención:* 🚨\n\nParece que has olvidado mencionar a un usuario para aplicar o eliminar una advertencia. Recuerda que es crucial seguir las reglas del grupo para garantizar una buena convivencia. Para advertir a alguien, asegúrate de usar el comando de forma correcta. Ejemplo: *.warn @usuario [razón]*.\n\nTu colaboración hace del grupo un lugar mejor para todos. ¡Gracias!`,

        });

    }

    

    const userId = m.mentionedJid[0];

    const reason = args.slice(1).join(' ') || 'sin especificar'; 



    if (!global.warn) global.warn = {};

    if (!global.warn[userId]) global.warn[userId] = 0;

    if (command === 'warn' || command === 'advertir') {

        

        global.warn[userId] += 
        

        if (global.warn[userId] >= 3) {

        

            await conn.sendMessage(m.chat, {

                text: `🔄 *Proceso en curso* 🔄\n\nEstamos procesando la eliminación de @${userId.split('@')[0]} del grupo por alcanzar el límite de advertencias permitidas.\n\n⚠️ *Razón de la expulsión:* Acumulación de advertencias que no han sido tomadas en cuenta y por incumplimiento de las normas establecidas en este grupo. La paciencia tiene un límite, y hoy lo has alcanzado.`,

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

                text: `⚠️ *Has sido expulsado del grupo* ⚠️\n\n📋 *Razón:* Has acumulado 3 advertencias en el grupo.`,

            });

            delete global.warn[userId]; 

            return;

        }

        

        await conn.sendMessage(m.chat, {

            text: `🔔 *Advertencia aplicada* 🔔\n\n@${userId.split('@')[0]}, has recibido una advertencia.\n\n📋 *Razón:* ${reason}\n\n📝 *Total de advertencias:* ${global.warn[userId]}/3.\nSi llegas a 3 advertencias, serás expulsado.`,

            mentions: [userId],

        });

    } else if (command === 'delwarn') {

        if (global.warn[userId] > 0) {

            global.warn[userId] -= 1;

            await conn.sendMessage(m.chat, {

                text: `✅ *Advertencia eliminada* ✅\n\n@${userId.split('@')[0]} ahora tiene ${global.warn[userId]} advertencias restantes.`,

                mentions: [userId],

            });

        } else {

            await conn.sendMessage(m.chat, {

                text: `⚠️ *Error al eliminar advertencia* ⚠️\n\n@${userId.split('@')[0]} no tiene advertencias registradas en este grupo.`,

                mentions: [userId],

            });

        }

    } else if (command === 'listwarns') {

        

        let list = Object.keys(global.warn).map(jid => {

            return `@${jid.split('@')[0]}: ${global.warn[jid]} advertencias`;

        }).join('\n');

        if (!list) list = 'Actualmente no hay usuarios con advertencias en este grupo. Todo parece estar bajo control, lo cual es algo positivo para la comunidad. Sigamos manteniendo el respeto y las buenas prácticas.';

        await conn.sendMessage(m.chat, {

            text: `📋 *Lista de advertencias del grupo* 📋\n\n${listwarns}`,

        });

    }

};



handler.command = /^(advertir|warn|delwarn|listwarns)$/i
handler.tag = ['group']
handler.admin = true; 

handler.group = true; // Puede usarse en grupos

export default handler;
