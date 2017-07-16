import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authApiRouter = express.Router();

authApiRouter.post('/',
  (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new Error('wrong_password'));
      }

      const payload = { id: user.id };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          issuer: process.env.JWT_ISSUER,
          audience: process.env.JWT_AUDIENCE,
        },
      );

      return res.json({ jwt: token });
    })(req, res, next);
  });

module.exports = authApiRouter;
