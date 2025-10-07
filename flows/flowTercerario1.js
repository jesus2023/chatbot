const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario1 = addKeyword(['terceariouno'])
  .addAnswer(
    `🎰 *Chance y otras apuestas*

Este es el grupo de chance y apuestas que puedes jugar en nuestros puntos.

🅐 *La quinta*:  
- Selecciona un número de cinco (5) cifras y una lotería o sorteo autorizado.

🅑 *Chance*:  
- Selecciona un número en modalidad de 4, 3, 2 o 1 cifra.

🅒 *Tripletazo*:  
- Ganas acertando las dos últimas cifras de tres sorteos o loterías del día.

🅓 *Doble chance*:  
- Selecciona cinco (5) números y gana si dos coinciden con los resultados de dos sorteos del mismo día.

🅔 *Chance Millonario*:  
- Selecciona 5 números de 4 cifras y 2 loterías, gana si aciertas en ambos.

🅕 *Paga 3*:  
- Combina números de dos (2) y tres (3) cifras con dos sorteos del día.

🅖 *Ka$h*:  
- Apuesta entre $500 y $10.000 en una de las 10 modalidades.

🅗 *Paga Más+*:  
- Escoge un número de tres (3) o cuatro (4) cifras con cualquier sorteo autorizado.

🅘 *Familia Baloto*:  
- Baloto, Miloto y Colorloto disponibles. Consulta resultados en https://baloto.com/resultados`
  )

  // Pregunta de seguimiento
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowApuestas = require('./flowApuestas'); // o el flujo que corresponda
        return gotoFlow(flowApuestas);
      }

      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowTercerario1;