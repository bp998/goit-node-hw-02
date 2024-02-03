import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { User } from "#models/User.js";

export default function setJWTStrategy() {
  const SECRET = process.env.SECRET;
  const params = {
    secretOrKey: SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new JWTStrategy(params, async (payload, done) => {
      try {
        const user = await User.findById(payload.id).lean();
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
}
