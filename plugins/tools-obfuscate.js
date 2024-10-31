import fs from 'fs';

import path from 'path';

let handler = async (m, { conn, args, usedPrefix, command }) => {

    try {

        const input = args.join(' ').split('|');

        const fileName = input[0]?.trim();

        const code = input[1]?.trim();

        if (!fileName || !code) {

            return m.reply(`❗ *Uso incorrecto del comando.*\n\n✨ *Formato correcto:* ${usedPrefix + command} <nombre archivo.js>|<código>`);

        }

        const ofuscarCodigo = (codigo) => {

            const ofuscado = `eval(String.fromCharCode(${codigo.split('').map(char => char.charCodeAt(0)).join(',')}))`;

            return ofuscado;

        };

        const obfuscatedCode = ofuscarCodigo(code);

        const filePath = path.join('/tmp', fileName);

        fs.writeFileSync(filePath, obfuscatedCode);

        await conn.sendFile(m.chat, filePath, fileName, '✨ *Código Ofuscado.*', m, null, { mimetype: 'text/plain' });

        fs.unlink(filePath, (err) => {

            if (err) console.error('Error al eliminar el archivo:', err);

        });

    } catch (error) {

        console.error('Error:', error);

        m.reply(`⚠️ *Error:* ${error.message}`);

    }

};

handler.help = ['ofuscar <nombre archivo.js>|<código>'];

handler.tags = ['tools'];

handler.command = ['ofuscar', 'obfuscate', 'eval', 'obf'];

handler.register = true;

export default handler;