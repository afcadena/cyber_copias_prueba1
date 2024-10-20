const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // Si es administrador, sigue con la siguiente función
    } else {
      return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
    }
  };
  
  export default adminMiddleware;   