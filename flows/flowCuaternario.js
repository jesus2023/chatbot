const { addKeyword } = require('@bot-whatsapp/bot');

const flowCuaternario = addKeyword(['4', 'giros', 'tarifas'])
  .addAnswer(
    `💰 *Tarifas Giros Nacionales e Internacionales*

📌 *Giros Nacionales:*  
Aquí tienes las tarifas estipuladas para el envío de tus Giros Nacionales.

(Solicitar al área de innovación que la respuesta sea por medio de una imagen con arte innovador)

📌 *Giros Internacionales:*  
Estimado usuario, ten en cuenta que el costo del flete para el envío de giros internacionales no es fijo, ya que depende directamente de la tasa de cambio del dólar al momento de hacer el giro.`
  )
  .addAnswer(
    "¿Te puedo ayudar en algo más?\n1️⃣ Sí\n2️⃣ No",
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const r = ctx.body.trim().toLowerCase();

      if (r === "1" || r.includes("si") || r.includes("sí")) {
        // Aún no existe el flujo de detalle de giros
        const flowGiros= require('./flowGiros'); 
        return gotoFlow(flowGiros);
      }

      if (r === "2" || r.includes("no")) {
        const flowGracias = require('./flowGracias');
        return gotoFlow(flowGracias);
      }

      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowCuaternario;