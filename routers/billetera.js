import express from 'express';
import billeteraController from '../controllers/BilleteraController.js';

const router = express.Router();

router.post('/recargar', billeteraController.recargarBilletera);

router.get('/consultar-saldo/:documento/:celular', billeteraController.consultarSaldo);

export default router;
