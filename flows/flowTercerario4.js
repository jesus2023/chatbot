const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario4 = addKeyword(['terceariocuatro'])
  .addAnswer(
    `🏦 *Recaudos y pagos*

De forma segura y rápida paga tus servicios públicos 💡💧📶 y realiza transacciones bancarias en diferentes bancos.`
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

module.exports = flowTercerario4;