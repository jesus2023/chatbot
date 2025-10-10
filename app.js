const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres');

// Configuración de base de datos PostgreSQL
const POSTGRES_DB_HOST = process.env.DB_HOST;
const POSTGRES_DB_USER = process.env.DB_USER;
const POSTGRES_DB_PASSWORD = process.env.DB_PASS;
const POSTGRES_DB_NAME = process.env.DB_NAME;
const POSTGRES_DB_PORT = process.env.DB_PORT;

// Importamos los flujos hijos
const flowResultados = require('./flows/flowResultados');
const flowResultadosAnteriores = require('./flows/flowResultadosAnteriores');
const flowEnviarCorreo = require('./flows/flowEnviarCorreo');
const flowSecundario = require('./flows/flowSecundario');
const flowGracias = require('./flows/flowGracias');
const flowInformacionGeneral = require('./flows/flowInformacionGeneral')
const flowPremios = require('./flows/flowPremios')
const flowTercerario = require('./flows/flowTercerario');
const flowApuestas = require('./flows/flowApuestas');
const flowTercerario1 = require('./flows/flowTercerario1');
const flowTercerario2 = require('./flows/flowTercerario2');
const flowTercerario3 = require('./flows/flowTercerario3');
const flowTercerario4 = require('./flows/flowTercerario4');
const flowTercerario5 = require('./flows/flowTercerario5');
const flowTercerario6 = require('./flows/flowTercerario6');
const flowTercerario7 = require('./flows/flowTercerario7');
const flowCuaternario = require('./flows/flowCuaternario')
const flowGiros = require('./flows/flowGiros')
const flowQuintario = require('./flows/flowQuintario')
const flowPreguntasPqrs = require('./flows/flowPreguntasPqrs')
const flowContactoTelefonico = require('./flows/flowContactoTelefonico')
const flowSextario = require('./flows/flowSextario')
const flowSeptario = require('./flows/flowSeptario')
const flowFallback =require('./flows/flowFallback')
const flowResultadosConfirmacion = require('./flows/flowResultadosConfirmacion')

const flowPrincipal = addKeyword(['hola', 'buenas', 'buenos'])
  .addAnswer('¡Hola! Soy *Sara* 👩🏻, encantada de atenderte. A continuación, te presento una lista de opciones en las que puedo ayudarte:')
  .addAnswer(
    '📌 *Menú principal:*\n\n' +
      '1️⃣ Resultados de chance y loterías\n' +
      '2️⃣ Horario de atención puntos de venta\n' +
      '3️⃣ Conocer productos y servicios\n' +
      '4️⃣ Tarifas de giros nacional e internacionales\n' +
      '5️⃣ Presentar una PQRS\n' +
      '6️⃣ Trabaja con nosotros\n' +
      '7️⃣ Otros\n\n' +
      'Por favor, escribe el número de la opción que deseas:',
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const respuesta = ctx.body.trim();

      // Validar que el usuario haya escrito un número entre 1 y 7
      if (!/^[1-7]$/.test(respuesta)) {
        await flowDynamic('⚠️ Por favor selecciona una opción válida (1 al 7).');
        return fallBack();
      }

      // Si es válido, continúa normalmente (irá al flujo correspondiente)
      return;
    },
    [
      flowResultados,
      flowSecundario,
      flowTercerario,
      flowCuaternario,
      flowQuintario,
      flowSextario,
      flowSeptario,
      flowGracias,
    ]
  );

module.exports = flowPrincipal;

// Función principal para iniciar el bot
const main = async () => {
  // Configuramos el adaptador de base de datos con tabla explícita
  const adapterDB = new PostgreSQLAdapter({
    host: POSTGRES_DB_HOST,
    user: POSTGRES_DB_USER,
    database: POSTGRES_DB_NAME,
    password: POSTGRES_DB_PASSWORD,
    port: POSTGRES_DB_PORT,
    tableName: 'whatsapp_state' // tabla donde se guarda el estado de cada usuario
  });

  // Creamos el flujo principal junto con los hijos
  const adapterFlow = createFlow([
    flowPrincipal,
    flowResultadosAnteriores,
    flowEnviarCorreo,
    flowGracias,
    flowInformacionGeneral,
    flowPremios,
    flowApuestas,
    flowTercerario1,
    flowTercerario2,
    flowTercerario3,
    flowTercerario4,
    flowTercerario5,
    flowTercerario6,
    flowTercerario7,
    flowGiros,
    flowPreguntasPqrs,
    flowContactoTelefonico,
    flowFallback,
    flowResultadosConfirmacion
  ]);

  // Proveedor de WhatsApp
  const adapterProvider = createProvider(BaileysProvider);

  // Creamos el bot
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  // Portal web para visualizar QR y sesiones activas
  QRPortalWeb();
};

// Ejecutamos el bot
main();

module.exports = { flowPrincipal };