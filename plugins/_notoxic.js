let handler = async (m, { conn }) => {
    const mensaje = m.text.toLowerCase();
    
    if (m.isGroup) {
     
        if (!m.mentionedJid.includes(conn.user.jid) && m.replyMessage !== m.key.id) return; 
    }

    if (mensaje.includes("idiota")) {
        const respuestas = [
            "¿Y tú crees que decirme idiota te hace más inteligente?",
            "Quizás deberías pensar antes de hablar, ¿no crees?",
            "Yo puedo responder, pero prefiero no rebajarme a tu nivel.",
            "Idiota... ¿Ese es el límite de tu creatividad?",
            "Tu vocabulario parece limitado, ¿todo bien en casa?",
            "Decir 'idiota' no te hace mejor persona.",
            "¡Qué original! No he escuchado 'idiota' mil veces antes.",
            "Tal vez necesitas un diccionario para encontrar mejores palabras.",
            "Parece que te hace falta educación.",
            "Insultar es fácil, ser amable es un arte."
        ];
        await conn.reply(m.chat, respuestas[Math.floor(Math.random() * respuestas.length)], m);
    } else if (mensaje.includes("estúpido")) {
        const respuestas = [
            "Tu insistencia en insultar es interesante, ¿algún objetivo?",
            "Si 'estúpido' es todo lo que tienes, me preocupa por ti.",
            "¿Es este tu nivel de debate? No me sorprende.",
            "Gracias por compartir, pero no me interesa tu opinión.",
            "La palabra 'estúpido' parece describir mejor tus intentos.",
            "¿Es tu forma de llamar la atención?",
            "¡Qué insulto tan... vacío!",
            "Parece que tienes un mal día, pero no es mi culpa.",
            "Eres libre de hablar, pero intenta hacerlo mejor.",
            "Tal vez ser más amable te ayude a sentirte mejor."
        ];
        await conn.reply(m.chat, respuestas[Math.floor(Math.random() * respuestas.length)], m);
    } else if (mensaje.includes("imbécil")) {
        const respuestas = [
            "Imbécil... Bueno, todos tenemos días difíciles.",
            "Quizás deberías enfocarte en mejorar tu actitud.",
            "No necesito tu validación para saber quién soy.",
            "Interesante elección de palabras, ¿algo más creativo?",
            "Tu insistencia en insultar no te hará feliz.",
            "Tal vez deberías invertir tiempo en aprender respeto.",
            "Insultos simples, respuestas simples: ¡Adiós!",
            "¿No tienes algo más interesante que decir?",
            "Usar insultos solo muestra tus limitaciones.",
            "Espero que insultar te haga sentir mejor porque no me afecta."
        ];
        await conn.reply(m.chat, respuestas[Math.floor(Math.random() * respuestas.length)], m);
    }
}

handler.customPrefix = /^(idiota|estúpido|imbécil)$/i;
handler.command = new RegExp();
export default handler;