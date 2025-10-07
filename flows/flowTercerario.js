const { addKeyword } = require('@bot-whatsapp/bot');

const flowTercerario = addKeyword(['productos', 'servicios', '3', 'tercerario'])
  .addAnswer(
    `📋 Te presentamos nuestros productos y servicios:

1️⃣ Chance y otras apuestas  
2️⃣ Betplay  
3️⃣ Giros nacionales e internacionales  
4️⃣ Recaudos y pagos  
5️⃣ Loterías físicas, en línea y raspa y listo  
6️⃣ SOAT  
7️⃣ Recargas

Por favor ingresa el número de la opción que deseas conocer más.`,
    { capture: true },
    async (ctx, { gotoFlow, fallBack }) => {
      const opcion = ctx.body.trim();
      switch(opcion) {
        case "1":
          return gotoFlow(require('./flowTercerario1'));
        case "2":
          return gotoFlow(require('./flowTercerario2'));
        case "3":
          return gotoFlow(require('./flowTercerario3'));
        case "4":
          return gotoFlow(require('./flowTercerario4'));
        case "5":
          return gotoFlow(require('./flowTercerario5'));
        case "6":
          return gotoFlow(require('./flowTercerario6'));
        case "7":
          return gotoFlow(require('./flowTercerario7'));
        default:
          return fallBack("⚠️ Por favor selecciona una opción válida del 1 al 7.");
      }
    }
  );

module.exports = flowTercerario;