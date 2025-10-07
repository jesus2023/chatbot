const { addKeyword } = require('@bot-whatsapp/bot');
const mysql = require('mysql2/promise');
const flowResultadosAnteriores = require('./flowResultadosAnteriores'); // flujo hijo

const flowResultados = addKeyword(['1', 'resultados', 'sorteos'])
.addAction(async (_, { flowDynamic }) => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DB
        });

        const loterias = [
            "Antioqueña","Astro Lun","Astro Sol","BOGOTA","BOYACA","Cafeterito 2",
            "Caribe Noche","Caribeña Dia","CAUCA","Chontico","CRUZROJA","Culona",
            "CUNDINAMARCA","Dorado Mañana","Dorado Tarde","El Pijao","Fantastica Dia",
            "Fantastica Noche","HUILA","MANIZALES","MEDELLIN","META","Paisita 1",
            "Paisita 2","QUINDIO","RISARALDA","SANTANDER","Sinuano Dia","Sinuano Noche",
            "TOLIMA","VALLE"
        ];

        const resultados = {};

        for (const loteria of loterias) {
            const [rows] = await conn.execute(`
                SELECT NUMERO, SERIE
                FROM wp9a_resultados
                WHERE LOTERIA = ?
                ORDER BY FECHA DESC
                LIMIT 1
            `, [loteria]);
            resultados[loteria] = rows[0] ? `${rows[0].NUMERO} ${rows[0].SERIE || '-'}` : '-';
        }

        await conn.end();

        let mensaje = "📊 *RESULTADOS SORTEOS* 📊\n\n";
        mensaje += "*LOTERÍA* | *NÚMERO* | *SERIE/5TA*\n";
        mensaje += "-----------------------------\n";
        loterias.forEach(loteria => {
            mensaje += `*${loteria.toUpperCase()}* | ${resultados[loteria].split(' ')[0]} | ${resultados[loteria].split(' ')[1] || '-'}\n`;
        });

        return await flowDynamic(mensaje);
    } catch (error) {
        console.error("Error al consultar resultados:", error);
        return await flowDynamic("❌ Hubo un error al consultar los resultados.");
    }
})
.addAnswer(
    "¿Te puedo ayudar en algo más?\n\n1️⃣ Si: Resultados anteriores\n2️⃣ No: Gracias",
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
        const r = ctx.body.trim().toLowerCase();
        if (r === '1' || r.includes('si')) return gotoFlow(flowResultadosAnteriores);
        if (r === '2' || r === 'no' || r.includes('gracias')) return await flowDynamic("¡Gracias por consultar! 👋");
        await flowDynamic("❌ No entendí. Por favor responde con `1` o `2`.");
        return fallBack();
    }
);

module.exports = flowResultados;