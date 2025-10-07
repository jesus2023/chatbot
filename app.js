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
const flowTercerario = require('./flows/flowTercerario')

// Flujo principal
const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
  .addAnswer('🙌 Hola, bienvenido a este *Chatbot*')
  .addAnswer(
    '📌 *Menú principal:*\n\n' +
    '1. Resultados de chance y loterías\n' +
    '2. Horario de atención puntos de venta\n' +
    '3. Conocer productos y servicios\n' +
    '4. Tarifas de giros nacional e internacionales\n' +
    '5. Presentar una PQRS\n' +
    '6. Trabaja con nosotros\n' +
    '7. Otros',
    null,
    null,
    [flowGracias, flowSecundario, flowTercerario, flowResultados]
  );

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
  const adapterFlow = createFlow([flowPrincipal, flowResultadosAnteriores, flowEnviarCorreo, flowGracias, flowInformacionGeneral, flowPremios]);

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