import UglifyJS from 'uglify-js';

let handler = async (m, { text }) => {
    try {
        if (!text) {
            return m.reply('Por favor, proporcione el código que desea ofuscar.');
        }

        const result = UglifyJS.minify(text, {
            compress: {
                dead_code: true,
                drop_console: true,
                global_defs: { DEBUG: false },
            },
            mangle: {
                toplevel: true,
                reserved: ['$', '_'],
            },
            output: {
                beautify: false,
                comments: false,
            }
        });

        if (result.error) {
            return m.reply('Hubo un error al ofuscar el código.');
        }

        let obfuscatedCode = result.code;

        obfuscatedCode = applySecurityLayer(obfuscatedCode);

        obfuscatedCode = injectRandomCode(obfuscatedCode);

        m.reply(`Código ofuscado con seguridad:\n\n\`\`\`js\n${obfuscatedCode}\n\`\`\``);
    } catch (error) {
        m.reply('Hubo un problema procesando el código.');
    }
};

function applySecurityLayer(code) {
    const randomSuffix = () => '_' + Math.random().toString(36).substring(2, 8);

    code = code.replace(/(var|let|const)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, p1, p2) => {
        return `${p1} ${p2 + randomSuffix()}`;
    });

    return code;
}

function injectRandomCode(code) {
    const randomCode = `
        var _0x${Math.random().toString(36).substring(2, 8)} = function() {
            var _0x${Math.random().toString(36).substring(2, 8)} = Math.random();
        };
    `;
    return randomCode + code;
}

handler.help = ['ofuscar'];
handler.tags = ['utilidades'];
handler.command = ['ofuscar'];

export default handler;