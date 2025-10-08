const { addKeyword } = require('@bot-whatsapp/bot');

// Fallback genérico
const flowFallback = addKeyword([/^.*$/]) // Regex que captura cualquier mensaje válido
  .addAnswer(
    "❌ Lo siento, no entendí tu mensaje.\n" +
    "Por favor, selecciona una opción del menú principal o escribe una palabra clave que reconozca el bot.\n\n" +
    "Si quieres volver al inicio, escribe 'menu'."
  );

module.exports = flowFallback;