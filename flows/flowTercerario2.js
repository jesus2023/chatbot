const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario2 = addKeyword(['terceariodos'])
  .addAnswer(
    `🎲 *Betplay*

Betplay es una casa de apuestas deportivas y casino online avalado por Coljuegos.  
Puedes apostar a todos los deportes desde $500, además de jugar en casinos, slots y bingo.`
  )
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();
      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowApuestas = require('./flowApuestas');
        return gotoFlow(flowApuestas);
      }
      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }
      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowTercerario2;