export default function authenticateJWT(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Доступ заборонено. Токен відсутній." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Недійсний або прострочений токен." });
  }
}
