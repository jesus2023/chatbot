const { addKeyword } = require('@bot-whatsapp/bot');

const flowContactoTelefonico = addKeyword(['4.2'])
  .addAnswer(
    "📞 *Líneas de atención al cliente*\n\nTe invitamos a comunicarte a nuestras líneas de atención telefónica: *(604) 7890042 ext 222*, en horarios de oficina."
  )
  .addAnswer(
    "🤖 ¿Te puedo ayudar en algo más?\n\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === "1" || r.includes("si") || r.includes("sí")) {
        const flowPreguntasPqrs = require('./flowPreguntasPqrs');
        return gotoFlow(flowPreguntasPqrs);
      }

      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowContactoTelefonico;