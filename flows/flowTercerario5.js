const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario5 = addKeyword(['terceariocinco'])
  .addAnswer(
    `🎟️ *Loterías y Raspa y Listo*

Compra tus loterías favoritas de manera tradicional y en línea.  
Además, disfruta de *Raspa y Listo*, con más de 14 juegos donde solo debes raspar el tiquete y si encuentras el símbolo o combinación ganadora, ¡ganaste! 🏆`
  )
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();
      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowPremios = require('./flowPremios');
        return gotoFlow(flowPremios);
      }
      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }
      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowTercerario5;