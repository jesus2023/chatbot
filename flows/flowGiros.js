const { addKeyword } = require('@bot-whatsapp/bot');

const flowGiros = addKeyword(['giros', 'consulta giros'])
  .addAnswer(
    `📌 *Consultas sobre giros:*

1️⃣ ¿Dónde puedo reclamar y enviar un giro?
2️⃣ Consultar el estado de mi giro
3️⃣ Conoce la política de tratamiento de datos personales

Por favor ingresa el número de la opción que deseas consultar.`,
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const opcion = ctx.body.trim();
      const respuestas = {
        "1": `✅ Envía y reclama tu giro en nuestros puntos de venta.  
Si prefieres hacerlo desde casa, también puedes usar la app *SUPERGIROS MÓVIL*.  

✅ ¡Descarga la aplicación y disfruta de mayor comodidad! Disponible en *Playstore* y *iOS*`,
        "2": `1️⃣ Consulta el estado de tu giro aquí: https://rastreogiros.supergiros.com.co/`,
        "3": `Te invitamos a conocer nuestra política de tratamiento de datos personales en el siguiente link:  

https://www.supergiros.com.co/loader.php?lServicio=Tools2&lTipo=descargas&lFuncion=visorpdf&id=3365&pdf=1`
      };

      if (!respuestas[opcion]) {
        await flowDynamic("⚠️ Por favor selecciona una opción válida del 1 al 3.");
        return fallBack();
      }

      await flowDynamic(respuestas[opcion]);
    }
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

module.exports = flowGiros;