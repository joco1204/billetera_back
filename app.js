import express from 'express';
import sequelize from './config/db.js';
import clienteRoutes from './routers/cliente.js';
import billeteraRoutes from './routers/billetera.js';
import movimientoRoutes from './routers/movimiento.js'; // Importa las rutas de movimiento
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/cliente', clienteRoutes);
app.use('/api/billetera', billeteraRoutes);
app.use('/api/movimiento', movimientoRoutes);

sequelize.authenticate()
    .then(() => console.log('Conexión a la base de datos establecida.'))
    .catch(err => console.error('No se pudo conectar a la base de datos:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
