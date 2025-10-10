const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario7 = addKeyword(['terceariosiete'])
  .addAnswer(
    `📱 *Recargas y pines de entretenimiento*

En nuestros puntos de venta puedes hacer recargas y comprar paquetes para los siguientes operadores:

🔹 Claro
🔹 Tigo
🔹 Movistar
🔹 WOM
🔹 Virgin Mobile
🔹 Móvil Éxito
🔹 Móviles 4G ETB
🔹 Kalley Móvil

🎮 Además, puedes adquirir pines de entretenimiento para tus plataformas favoritas:

🔹 Netflix
🔹 Office
🔹 PlayStation
🔹 IMVU
🔹 Rixty
🔹 Xbox
🔹 Spotify
🔹 Kaspersky
🔹 Free Fire
🔹 Paramount+
🔹 Crunchyroll
🔹 ViX
🔹 Roblox
🔹 McAfee`
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

module.exports = flowTercerario7;