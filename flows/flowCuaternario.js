const { addKeyword } = require('@bot-whatsapp/bot');

const flowCuaternario = addKeyword(['4', 'giros', 'tarifas'])
  .addAnswer(
    `💰 *Tarifas Giros Nacionales e Internacionales*

📌 *Giros Nacionales:*  
Aquí tienes las tarifas estipuladas para el envío de tus Giros Nacionales:

| Desde       | Hasta       | Fletes  | Otros | Total  |
|------------|------------|--------|-------|-------|
| $1         | $50.000    | $4.700 | $0    | $4.700 |
| $50.001    | $100.000   | $6.000 | $0    | $6.000 |
| $100.001   | $150.000   | $7.500 | $0    | $7.500 |
| $150.001   | $200.000   | $8.300 | $0    | $8.300 |
| $200.001   | $250.000   | $8.900 | $900  | $9.800 |
| $250.001   | $300.000   | $9.400 | $900  | $10.300 |
| $300.001   | $350.000   | $9.900 | $900  | $10.800 |
| $350.001   | $400.000   | $10.400| $900  | $11.300 |
| $400.001   | en adelante| 2.6%   | $900  | *Valor flete + otros* |

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
        const flowGiros = require('./flowGiros'); 
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