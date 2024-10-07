import Movimiento from '../models/Movimiento.js';
import Billetera from '../models/Billetera.js';
import Cliente from '../models/Cliente.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Generar token de 6 dígitos
const generarToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generar id_sesion en base64
const generarIdSesion = () => {
    return crypto.randomBytes(16).toString('base64');
};

// Método para realizar un pago
export const realizarPago = async (req, res) => {
    const { documento, celular, cuenta_destino, motivo, valor } = req.body;
    const token = generarToken();
    const id_sesion = generarIdSesion();

    try {
        
        // Buscar cliente por documento y celular
        const cliente = await Cliente.findOne(
            {
                where: { 
                    documento, 
                    celular 
                }
            }
        );

        if (!cliente) {
            return res.status(404).json({
                code: 404,
                message: "Cliente no encontrado"
            });
        }

        // Buscar la billetera del cliente
        const billetera = await Billetera.findOne({
            where: { id_cliente: cliente.id }
        });

        if (!billetera) {
            return res.status(404).json({
                code: 404,
                message: "Billetera no encontrada"
            });
        }

        // Validar saldo
        if (billetera.saldo < valor) {
            return res.status(400).json(
                {
                    code: 400,
                    message: "Saldo insuficiente"
                }
            );
        }

        // Enviar token al correo electrónico del cliente
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: cliente.email,
            subject: 'Confirmación de Pago',
            text: `Su token de confirmación es: ${token}. Utilícelo para confirmar su compra.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json(
            {
                code: 200,
                message: "Token enviado al correo electrónico. Por favor, confírmelo con su ID de sesión.",
                id_sesion,
                id_billetera: billetera.id,
                valor,
                cuenta_destino, 
                motivo
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                code: 500,
                message: "Error al realizar el pago",
                error: error.message
            }
        );
    }
};

// Método para confirmar el pago
export const confirmarPago = async (req, res) => {
    const { id_sesion, token, id_billetera, valor, cuenta_destino, motivo } = req.body;

    try {
        //Valido si el id de sesión y el token existen
        if (!id_sesion || !token) {
            return res.status(400).json({
                code: 400,
                message: "ID de sesión o token no proporcionado"
            });
        }

        //Consulta la billetera del cliente
        const billetera = await Billetera.findOne(
            {
                where: { 
                    id: id_billetera 
                }
            }
        );

        if (!billetera) {
            return res.status(404).json(
                {
                    code: 404,
                    message: "Billetera no encontrada"
                }
            );
        }

        //Validar si el saldo es suficiente para el descuento
        if (billetera.saldo < valor) {
            return res.status(400).json(
                {
                    code: 400,
                    message: "Saldo insuficiente"
                }
            );
        }

        //Realiza el descuento
        billetera.saldo = parseInt(billetera.saldo) - parseInt(valor);
        await billetera.save();

        //Registrar el pago en la tabla movimiento
        await Movimiento.create(
            {
                id_billetera,
                token,
                valor,
                cuenta_destino, 
                motivo,
                estado: 1
            }
        );

        return res.status(200).json(
            {
                code: 200,
                message: "Pago confirmado exitosamente"
            }
        );

    } catch (error) {
        return res.status(500).json(
            {
                code: 500,
                message: "Error al confirmar el pago",
                error: error.message
            }
        );
    }
};
