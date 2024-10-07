import express from 'express';
import clienteController from '../controllers/ClienteController.js';

const router = express.Router();
router.post('/registro', clienteController.crearCliente); 
export default router;
