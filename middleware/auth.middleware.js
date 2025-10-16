export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({
    message: "Доступ заборонено. Необхідна авторизація.",
    authenticated: false,
  });
}

export function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.status(400).json({
    message: "Ви вже авторизовані",
    authenticated: true,
  });
}
