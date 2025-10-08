const { addKeyword } = require('@bot-whatsapp/bot');
const mysql = require('mysql2/promise');

const flowResultadosAnteriores = addKeyword(['back'])
.addAnswer(
  "Por favor indícanos el día, mes y año exactos a consultar:\n📌 Ejemplo: 05/02/2025 (día/mes/año)",
  { capture: true },
  async (ctx, { fallBack, gotoFlow, flowDynamic }) => {
    const fecha = ctx.body.trim();
    const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(20\d{2})$/;

    if (!regexFecha.test(fecha)) {
      await flowDynamic("⚠️ Formato inválido. Usa dd/mm/yyyy\n📌 Ej: 05/02/2025");
      return fallBack();
    }

    try {
      const [dia, mes, anio] = fecha.split('/');
      const fechaMySQL = `${anio}-${mes}-${dia}`;
      const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
      });

      const [rows] = await conn.execute(`
        SELECT LOTERIA, NUMERO, SERIE 
        FROM wp9a_resultados 
        WHERE DATE(FECHA) = ?
        ORDER BY LOTERIA
      `, [fechaMySQL]);

      await conn.end();

      if (!rows.length) {
        await flowDynamic(`❌ No se encontraron resultados para ${fecha}`);
        return fallBack();
      }

      let mensaje = `📊 *RESULTADOS DEL ${fecha}* 📊\n\n`;
      mensaje += "*LOTERÍA* | *NÚMERO* | *SERIE*\n-----------------------------\n";
      rows.forEach(row => mensaje += `*${row.LOTERIA}* | ${row.NUMERO} | ${row.SERIE || '-'}\n`);

      await flowDynamic(mensaje);

      // Pasar al siguiente flujo de confirmación
      const flowResultadosConfirmacion = require('./flowResultadosConfirmacion');
      return gotoFlow(flowResultadosConfirmacion);

    } catch (error) {
      console.error('Error procesando fecha:', error);
      await flowDynamic('❌ Error al consultar resultados.');
      return fallBack();
    }
  }
);

module.exports = flowResultadosAnteriores;