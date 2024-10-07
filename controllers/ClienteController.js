import Cliente from '../models/Cliente.js';
import Billetera from '../models/Billetera.js';

// Método para crear cliente
const crearCliente = async (req, res) => {
    const { documento, nombre, email, celular } = req.body;

    try {
        const clienteExistente = await Cliente.findOne(
            { 
                where: { 
                    documento 
                } 
            }
        );

        if (clienteExistente) {
            return res.status(400).json(
                { 
                    code: 400, 
                    message: "El número de documento ya se encuentra registrado" 
                }
            );
        } else {
            const nuevoCliente = await Cliente.create(
                { 
                    documento, 
                    nombre, 
                    email, 
                    celular 
                }
            );

            await Billetera.create(
                { 
                    id_cliente: nuevoCliente.id, 
                    saldo: 0 
                }
            );

            return res.status(201).json(
                { 
                    code: 201, 
                    message: "Cliente ha sido registrado con éxito" 
                }
            );
        }
    } catch (error) {
        return res.status(500).json(
            { 
                code: 500, 
                message: "Error al crear cliente" 
            }
        );
    }
};

export default { crearCliente };
