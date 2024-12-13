let handler = async (m, { conn }) => {
    let texto = `
Guía para tener novia, digo usar el  BÓT ke apenas funka  

¿List@ pa kometer errores usándolo? Esta es la "guía" más meh ke vas a leer, pa ke no digas ke nadie te ayudó.  

---

EL GRAN PODEROSO .menú  
La puerta de entrada al kaos. Escribí .menú y el bot te tira su lista de "cosas ke hace". Si te konfundes, ya es problema tuyo.  

- *Descargas*: baja kosas ke ni necesitas.  
- *Search*: porke googlear te keda grande.  
- *Tools*: herramientas pa ke te sientas útil, pero no te garantizo nada.  

---

descargas  

Pa bajar kosas sin pagar (tu estilo de vida).  

1. *.play* y *.play2*:  
   - .play: Pa eskuchar .  
   - .play2: Pa ver videos MP4 o mp3, porke te gustan los videitos especialmente del mini mini.  
   - *Ejemplo*: .play linkdeltiktok  

2. *ytsearch*:  
   - Porke buscar en YouTube ahora necesita un intermediario.  
   - *Ejemplo*: .ytsearch cómo usar un bot.  

---

Search  

Buska kosas (ni dignidad ni sentido de vida, eso no está en la lista).  

1. *.google*:  
   - Literalmente una búsqueda de Google, pero kon estilo mediocre.  
   - *Ejemplo*: .google por ke soy tan floj@.  

2. *animesearch*:  
   - Buska animes, x si no podés recordar ké viste hace 10 minutos.  
   - *Ejemplo*: .animesearch Attack on Titan.  

---

Tools  

Herramientas pa sentirte más pro, aunke el bot hace todo el trabajo.  

1. *.imagen*:  
   - Buska imágenes, sí, tal vez te encuentres algo útil o no.  
   - *Ejemplo*: .imagen atardecer.  

2. *.calc*:  
   - Porke kalkular mentalmente no es lo tuyo.  
   - *Ejemplo*: .calc 7*8 (tip: no es 64).  

---

_DISCLAIMER FINAL_
Si rompés el bot o no entendés nada, no es mi problema. Ke lo disfrutes o algo así.
`;
    conn.reply(m.chat, texto, m);
};

handler.command = ['guía', 'guia','tutorial','tuto','como se usa']; 
handler.help = ['guía'];
handler.tags = ['info'];

module.exports = handler;