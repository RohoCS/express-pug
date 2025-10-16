import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

let registeredUsers = [];

export function initializePassport(users) {
  registeredUsers = users;

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = registeredUsers.find((u) => u.email === email);

          if (!user) {
            return done(null, false, { message: "Невірний email або пароль" });
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return done(null, false, { message: "Невірний email або пароль" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = registeredUsers.find((u) => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } else {
      done(new Error("Користувача не знайдено"));
    }
  });
}

export default passport;
