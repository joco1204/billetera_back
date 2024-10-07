import { Router } from 'express';
import { realizarPago, confirmarPago } from '../controllers/MovimientoController.js';

const router = Router();

router.post('/realizar-pago', realizarPago);

router.post('/confirmar-pago', confirmarPago);

export default router;