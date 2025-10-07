const { addKeyword } = require('@bot-whatsapp/bot');

// guardamos por usuario para evitar colisiones entre sesiones simultáneas
const ultimaOpcionPorUsuario = {};

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
    async (ctx, { flowDynamic, fallBack }) => {
      const opcion = ctx.body.trim();
      // guardamos la última opción por usuario (ctx.from es el ID del usuario)
      ultimaOpcionPorUsuario[ctx.from] = opcion;
      
      const respuestas = {
        "1": `🎰 *Chance y otras apuestas*

Este es el grupo de chance y apuestas que puedes jugar en nuestros puntos.

🅐 *La quinta*:  
- Selecciona un número de cinco (5) cifras y una lotería o sorteo autorizado.

🅑 *Chance*:  
- Selecciona un número en modalidad de 4, 3, 2 o 1 cifra.

🅒 *Tripletazo*:  
- Ganas acertando las dos últimas cifras de tres sorteos o loterías del día.

🅓 *Doble chance*:  
- Selecciona cinco (5) números y gana si dos coinciden con los resultados de dos sorteos del mismo día.

🅔 *Chance Millonario*:  
- Selecciona 5 números de 4 cifras y 2 loterías, gana si aciertas en ambos.

🅕 *Paga 3*:  
- Combina números de dos (2) y tres (3) cifras con dos sorteos del día.

🅖 *Ka$h*:  
- Apuesta entre $500 y $10.000 en una de las 10 modalidades.

🅗 *Paga Más+*:  
- Escoge un número de tres (3) o cuatro (4) cifras con cualquier sorteo autorizado.

🅘 *Familia Baloto*:  
- Baloto, Miloto y Colorloto disponibles. Consulta resultados en https://baloto.com/resultados`,
        
        "2": `🎲 *Betplay*

Betplay es una casa de apuestas deportivas y casino online avalado por Coljuegos.  
Puedes apostar a todos los deportes desde $500, además de jugar en casinos, slots y bingo.`,
        
        "3": `💸 *Giros nacionales e internacionales*

Envía y recibe giros nacionales e internacionales directamente en nuestros puntos de venta autorizados.`,
        
        "4": `🏦 *Recaudos y pagos*

De forma segura y rápida paga tus servicios públicos 💡💧📶 y realiza las siguientes transacciones bancarias:

🏦 BANCA MÍA  
- Recaudo de cartera  
- Retiros cuenta de ahorro  
- Depósitos a cuentas  
- Reembolsos y liberación de cupos

🏦 BANCO AGRARIO  
- Recaudos de convenios  
- Pago de cartera  
- Pago de tarjeta de crédito  
- Depósitos a cuentas

🏦 BANCO BBVA  
- Recaudo de convenios  
- Retiros OTP  
- Depósitos  
- Pagos

🏦 GRUPO AVAL  
- Recaudo de convenios  
- Retiros OTP  
- Depósitos  
- Pagos a terceros

🏦 FINANCIERA SUCRÉDITO  
- Retiros  
- Depósitos  
- Consultas

🏦 BANCOOMEVA  
- Recaudo de estado de cuenta

🏦 FUNDACIÓN DE LA MUJER  
- Recaudo de cartera`,
        
        "5": `🎟️ *Loterías y Raspa y Listo*

Compra tus loterías favoritas de manera tradicional y en línea.  
Además, disfruta de *Raspa y Listo*, con más de 14 juegos donde solo debes raspar el tiquete y si encuentras el símbolo o combinación ganadora, ¡ganaste! 🏆`,
        
        "6": `🚗 *SOAT*

Compra con nosotros el único SOAT en Córdoba que además de proteger tu vehículo, también protege tu vida. Expedido por *La Previsora Seguros*.`,
        
        "7": `📱 *Recargas y pines de entretenimiento*

Recargas y paquetes para:

🔹 Claro  
🔹 Tigo  
🔹 Movistar  
🔹 WOM  
🔹 Virgin Mobile  
🔹 Móvil Éxito  
🔹 Móviles 4G ETB  
🔹 Kalley Móvil

🎮 Pines de entretenimiento:

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
      };

      if (!respuestas[opcion]) {
        await flowDynamic("⚠️ Por favor selecciona una opción válida del 1 al 7.");
        // limpiamos por si acaso
        delete ultimaOpcionPorUsuario[ctx.from];
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
      const ultimaOpcion = ultimaOpcionPorUsuario[ctx.from];

      // Si elige "sí"
      if (r === "1" || r.includes("si") || r.includes("sí")) {
        // Limpiar la opción guardada
        delete ultimaOpcionPorUsuario[ctx.from];
        
        if (ultimaOpcion === "1") {
          // si la opción fue la 1 → ir al flujo de Apuestas
          const flowApuestas = require("./flowApuestas");
          return gotoFlow(flowApuestas);
        } else {
          // para cualquier otra opción → ir al flujo de Premios
          const flowPremios = require("./flowPremios");
          return gotoFlow(flowPremios);
        }
      }

      // Si elige "no"
      if (r === "2" || r.includes("no")) {
        // Limpiar la opción guardada
        delete ultimaOpcionPorUsuario[ctx.from];
        
        const flowGracias = require("./flowGracias");
        return gotoFlow(flowGracias);
      }

      // Si no entendió la respuesta
      return fallBack("❌ No entendí. Responde con `1` o `2`.");
    }
  );

module.exports = flowTercerario;