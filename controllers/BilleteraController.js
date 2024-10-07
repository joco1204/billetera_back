import Cliente from '../models/Cliente.js';
import Billetera from '../models/Billetera.js';

//Método para recargar billetera
const recargarBilletera = async (req, res) => {
    const { documento, celular, valor } = req.body;

    try {
        // Consultar cliente por número de documento y celular
        const cliente = await Cliente.findOne({
            where: { 
                documento, 
                celular 
            }
        });

        // Si no encuentra cliente, devuelve código de error 404 y mensaje de cliente no encontrado
        if (!cliente) {
            return res.status(404).json(
                {
                    code: 404,
                    message: "Cliente no encontrado"
                }
            );
        }

        // Buscar la billetera del cliente
        const billetera = await Billetera.findOne(
            {
                where: { 
                    id_cliente: cliente.id 
                }
            }
        );

        // Actualizar el saldo de la billetera
        billetera.saldo = parseInt(billetera.saldo) + parseInt(valor);
        await billetera.save();

        // Devuelve código 200 y mensaje de recarga exitosa
        return res.status(200).json(
            {
                code: 200,
                message: "Recarga exitosa"
            }
        );
    } catch (error) {
        // Devuelve código de error 500 y mensaje de error al recargar billetera
        return res.status(500).json(
            {
                code: 500,
                message: "Error al recargar billetera"
            }
        );
    }
};

//Método para consultar saldo
const consultarSaldo = async (req, res) => {
    const { documento, celular } = req.params;

    try {
        // Buscar cliente por documento y celular
        const cliente = await Cliente.findOne({
            where: { 
                documento, celular 
            }
        });

        // Si no encuentra cliente, devuelve código de error 404 y mensaje de cliente no encontrado
        if (!cliente) {
            return res.status(404).json(
                {
                    code: 404,
                    message: "Cliente no encontrado"
                }
            );
        }

        // Buscar la billetera del cliente
        const billetera = await Billetera.findOne(
            {
                where: { 
                    id_cliente: cliente.id 
                }
            }
        );

        // Devuelve el código 200 y saldo de billetera del cliente
        return res.status(200).json(
            {
                code: 200,
                message: "Consulta realizada con éxito",
                saldo: billetera.saldo
            }
        );

    } catch (error) {
        // Devuelve código de error 500 y mensaje de error al consultar saldo
        return res.status(500).json(
            {
                code: 500,
                message: "Error al consultar saldo"
            }
        );
    }
};

export default {
    recargarBilletera,
    consultarSaldo
};
