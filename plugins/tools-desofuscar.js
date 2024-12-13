import UglifyJS from 'uglify-js';

let handler = async (m, { text }) => {
    try {
        const minifyOptions = {
            output: {
                beautify: true,
                indent_level: 2
            }
        };

        const result = UglifyJS.minify(text, minifyOptions);

        if (result.error) {
            return m.reply('Hubo un error al desofuscar el código: ' + result.error.message);
        }

        let resultCode = result.code;

        resultCode = resultCode.replace(/var\s+([a-zA-Z0-9_]+)\s*=\s*([^]+)/g, (match, varName, arrContent) => {
            const values = arrContent.split(',').map(val => val.trim().replace(/['"]/g, ''));
            return `var ${varName} = ${JSON.stringify(values)};`;
        });

        m.reply(`Código desofuscado:\n\`\`\`js\n${resultCode}\n\`\`\``);
    } catch (error) {
        console.error(error);
        m.reply('Hubo un problema procesando el código.');
    }
};

handler.help = ['desofuscar'];
handler.tags = ['utilidades'];
handler.command = ['desofuscar'];

export default handler;