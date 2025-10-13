# Express.js проект з PUG/EJS, Cookies та JWT

## 🚀 Швидкий старт

### Встановлення залежностей
```bash
npm install
```

### Запуск сервера
```bash
node index.js
```

Сервер запуститься на `http://localhost:3000`

## 📋 Реалізовані функції

### ✅ 1. Статичні файли та Favicon
- ✓ Налаштовано Express для обслуговування статичних файлів з папки `public`
- ✓ Favicon доступний за адресою `/img/favicon.ico`
- ✓ Всі шаблони PUG та EJS містять тег `<link rel="icon" href="/img/favicon.ico">`

### ✅ 2. Робота з Cookies - Збереження теми оформлення
- ✓ **POST /set-theme** - Збереження улюбленої теми користувача (light/dark/auto)
- ✓ **GET /get-theme** - Отримання поточної теми
- ✓ Використовується `cookie-parser` middleware
- ✓ Cookie зберігається на 30 днів

### ✅ 3. JWT Authentication
- ✓ **POST /register** - Реєстрація нового користувача
- ✓ **POST /login** - Вхід користувача з генерацією JWT токену
- ✓ **POST /logout** - Вихід користувача (очищення cookie)
- ✓ JWT токени зберігаються в `httpOnly` cookies для безпеки
- ✓ Термін дії токену: 24 години
- ✓ Захист від XSS та CSRF атак

### ✅ 4. Захищені маршрути
- ✓ **GET /profile** - Захищений маршрут (потрібна авторизація)
- ✓ **GET /auth-status** - Перевірка статусу авторизації
- ✓ Middleware `authenticateJWT` для перевірки токенів

### ✅ 5. Існуючі маршрути
- ✓ **GET /users** - Список користувачів (PUG шаблон)
- ✓ **GET /users/:id** - Користувач за ID (PUG шаблон)
- ✓ **GET /articles** - Список статей (EJS шаблон)
- ✓ **GET /articles/:id** - Стаття за ID (EJS шаблон)

## 🧪 Тестування

### Веб-інтерфейс для тестування
Відкрийте у браузері: `http://localhost:3000/test.html`

Ця сторінка містить інтерактивний інтерфейс для тестування всіх функцій:
- Реєстрація та вхід користувачів
- Зміна теми оформлення
- Доступ до захищених маршрутів
- Перевірка статусу авторизації

### Тестування через curl

#### 1. Реєстрація користувача
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "pass123", "email": "test@example.com"}'
```

#### 2. Вхід
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "pass123"}' \
  -c cookies.txt
```

#### 3. Встановити тему
```bash
curl -X POST http://localhost:3000/set-theme \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark"}' \
  -b cookies.txt
```

#### 4. Отримати профіль (захищений маршрут)
```bash
curl http://localhost:3000/profile -b cookies.txt
```

#### 5. Вихід
```bash
curl -X POST http://localhost:3000/logout -b cookies.txt
```

## 📁 Структура проекту

```
61.express_pug/
├── index.js                    # Головний файл сервера
├── package.json               # Залежності
├── API_DOCUMENTATION.md       # Детальна документація API
├── README.md                  # Цей файл
├── public/                    # Статичні файли
│   ├── test.html             # Веб-інтерфейс для тестування
│   └── img/
│       └── favicon.ico       # Favicon
└── src/
    ├── pug/                  # PUG шаблони
    │   ├── users.pug
    │   └── user.pug
    └── ejs/                  # EJS шаблони
        ├── articles.ejs
        └── article.ejs
```

## 🔧 Технології

- **Express.js** v5.1.0 - Web framework
- **PUG** v3.0.3 - Шаблонізатор
- **EJS** v3.1.10 - Шаблонізатор
- **cookie-parser** - Middleware для роботи з cookies
- **jsonwebtoken** v9.0.2 - JWT токени
- **joi** v18.0.1 - Валідація (встановлено)

## 🔒 Безпека

### ⚠️ ВАЖЛИВО для продакшену:

1. **JWT Secret**: Змініть `JWT_SECRET` на безпечний ключ
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
   ```

2. **Хешування паролів**: Використовуйте bcrypt
   ```bash
   npm install bcrypt
   ```
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **HTTPS**: Увімкніть `secure: true` для cookies
   ```javascript
   res.cookie("authToken", token, {
     httpOnly: true,
     secure: true,  // Тільки через HTTPS
     sameSite: "strict"
   });
   ```

4. **База даних**: Замініть масиви в пам'яті на реальну БД (MongoDB, PostgreSQL, etc.)

5. **Rate Limiting**: Додайте обмеження кількості запитів
   ```bash
   npm install express-rate-limit
   ```

6. **Валідація**: Використовуйте Joi для валідації вхідних даних

## 📚 Документація

Детальну документацію API дивіться у файлі `API_DOCUMENTATION.md`

## 🎯 Приклади використання

### JavaScript на клієнті
```javascript
// Реєстрація
const response = await fetch('/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john',
    password: 'secret',
    email: 'john@example.com'
  })
});

// Вхід
await fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'john', password: 'secret' }),
  credentials: 'include' // Важливо для cookies
});

// Встановити тему
await fetch('/set-theme', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ theme: 'dark' }),
  credentials: 'include'
});

// Отримати профіль
const profile = await fetch('/profile', {
  credentials: 'include'
});
```

## 🐛 Відомі обмеження

1. Користувачі зберігаються в пам'яті (втрачаються при перезапуску)
2. Паролі не хешуються (тільки для демонстрації)
3. Немає валідації email формату
4. Немає rate limiting
5. Немає логування

## 📝 TODO для покращення

- [ ] Підключити базу даних (MongoDB/PostgreSQL)
- [ ] Додати bcrypt для хешування паролів
- [ ] Реалізувати валідацію через Joi
- [ ] Додати rate limiting
- [ ] Додати логування (Winston/Morgan)
- [ ] Додати тести (Jest/Mocha)
- [ ] Додати CORS налаштування
- [ ] Створити frontend з React/Vue
- [ ] Додати refresh tokens
- [ ] Реалізувати відновлення паролю

## 📞 Підтримка

Для питань та пропозицій створіть issue у репозиторії проекту.

---

**Автор:** Ваше ім'я  
**Версія:** 1.0.0  
**Ліцензія:** ISC
