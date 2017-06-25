import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

import User from '../../models/User';
import isEmail from '../../libs/isEmail';
import ensureLoggedIn from '../../middlewares/ensureLoggedIn';

const authRouter = express.Router();

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1',
  }),
});

const beforeAuthMiddleware = (req, res, next) => {
  if (req.user) {
    return res.redirect(req.query.returnTo || '/');
  }

  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }

  if (req.query.jwt === '1') {
    req.session.useJWT = true;
  }

  // hide Intercom
  res.locals.showIntercom = false;

  return next();
};

const afterAuthMiddleware = (req, res) => {
  if (req.session.useJWT) {
    const payload = { id: req.user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      },
    );
    req.session.useJWT = null;
    req.logout();
    return res.render('jwt', { token });
  }

  const returnTo = req.session.returnTo || '/';
  req.session.returnTo = null;

  return res.redirect(returnTo);
};

const generateTokenAsync = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) {
        return reject(err);
      }

      const token = buf.toString('hex');
      return resolve(token);
    });
  });

const sendVerificationEmail = user =>
  generateTokenAsync()
    .then(token =>
      user.updateAttributes({
        verifyToken: token,
      })
      .then(() => transporter.sendMail({
        from: 'support@getwebcatalog.com',
        to: user.email,
        subject: 'WebCatalog Email Verification',
        // eslint-disable-next-line
        text: 'Please confirm that you want to use this as your WebCatalog account email address.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'https://getwebcatalog.com/auth/verify/' + token + '\n\n' +
              'If you did not request this, please ignore this email.\n',
      })),
    );

authRouter.get('/', beforeAuthMiddleware, (req, res) => {
  res.render('auth/index', { title: 'Sign in to WebCatalog' });
});

authRouter.post('/',
  beforeAuthMiddleware,
  (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        if (err.message === 'NO_PASSWORD') {
          return res.render('auth/index', {
            title: 'Sign in to WebCatalog',
            email: req.body.email,
            loginErr: 'You haven\'t set up a WebCatalog password yet.',
          });
        }
        return next(err);
      }

      if (!user) {
        return res.render('auth/index', {
          title: 'Sign in to WebCatalog',
          email: req.body.email,
          loginErr: 'The email or password you entered is incorrect.',
        });
      }

      return req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return next();
      });
    })(req, res, next);
  },
  afterAuthMiddleware);

authRouter.get('/sign-up', beforeAuthMiddleware, (req, res) => {
  res.render('auth/sign-up', { title: 'Join WebCatalog' });
});

authRouter.post('/sign-up', beforeAuthMiddleware, (req, res, next) => {
  if (!req.body) return next(new Error('Request is not valid.'));

  if (!req.body.email || !req.body.password || !isEmail(req.body.email)) {
    return next(new Error('Request is not valid.'));
  }

  if (req.body.password.length < 6) {
    return next(new Error('Password must have at least 6 characters.'));
  }

  return User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        return res.render('auth/sign-up', {
          title: 'Join WebCatalog',
          email: req.body.email,
          emailError: 'The email is already taken.',
        });
      }

      return bcrypt.hash(req.body.password, 10)
        .then(hash =>
          User.create({
            email: req.body.email,
            password: hash,
            isVerified: false,
          }),
        )
        .then(createdUser => new Promise((resolve, reject) => {
          req.logIn(createdUser, (loginErr) => {
            if (loginErr) {
              reject(loginErr);
              return;
            }

            // sendVerificationEmail after signing up
            sendVerificationEmail(createdUser);

            resolve();
          });
        }))
        .then(() => next());
    })
    .catch(next);
}, afterAuthMiddleware);

authRouter.get('/reset-password', beforeAuthMiddleware, (req, res) => {
  res.render('auth/reset-password-request', { title: 'Reset Password' });
});

authRouter.post('/reset-password', beforeAuthMiddleware, (req, res, next) => {
  if (!req.body) return next(new Error('Request is not valid.'));

  if (!req.body.email || !isEmail(req.body.email)) {
    return next(new Error('Request is not valid.'));
  }

  return User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        return generateTokenAsync()
          .then(token =>
            user.updateAttributes({
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + (3600000 * 7), // 7 days,
            }).then(() => transporter.sendMail({
              from: 'support@getwebcatalog.com',
              to: req.body.email,
              subject: 'WebCatalog Password Reset',
              // eslint-disable-next-line
              text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'https://getwebcatalog.com/auth/reset-password/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
            })),
          )
          .then(() => res.render('auth/info', {
            title: 'Reset Password',
            infoMessage: `An e-mail has been sent to ${req.body.email} with instructions on resetting your password.`,
          }));
      }

      return res.render('auth/reset-password-request', {
        title: 'Reset Password',
        emailError: 'The email you provided is not associated with an active WebCatalog account.',
      });
    })
    .catch(next);
});

authRouter.get('/reset-password/:token', beforeAuthMiddleware, (req, res, next) => {
  User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
  })
  .then((user) => {
    if (!user) {
      return next(new Error('Token is invalid'));
    }

    return res.render('auth/reset-password-reset', {
      title: 'Reset Password',
    });
  })
  .catch(next);
});

authRouter.post('/reset-password/:token', beforeAuthMiddleware, (req, res, next) => {
  if (!req.body) return next(new Error('Request is not valid.'));

  if (!req.body.password) {
    return next(new Error('Request is not valid.'));
  }

  return User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
  })
  .then((user) => {
    if (!user) {
      return next(new Error('Token is expired or invalid.'));
    }

    return bcrypt.hash(req.body.password, 10)
      .then(hash =>
        user.updateAttributes({
          password: hash,
          resetPasswordToken: null,
          resetPasswordExpires: null, // 7 days,
        }),
      )
      .then(() => new Promise((resolve, reject) => {
        req.logIn(user, (loginErr) => {
          if (loginErr) {
            reject(loginErr);
            return;
          }
          resolve();
        });
      }))
      .then(() => next());
  })
  .catch(next);
}, afterAuthMiddleware);

authRouter.get('/verify', ensureLoggedIn, (req, res, next) => {
  sendVerificationEmail(req.user)
    .then(() => res.render('auth/info', {
      title: 'Verify Email',
      infoMessage: `An e-mail has been sent to ${req.user.email} with instructions on verifying your account.`,
    }))
    .catch(next);
});

authRouter.get('/verify/:token', beforeAuthMiddleware, (req, res, next) => {
  User.findOne({
    where: {
      verifyToken: req.params.token,
    },
  })
  .then((user) => {
    if (!user) {
      return next(new Error('Token is invalid.'));
    }

    return user.updateAttributes({
      isVerified: true,
    })
    .then(() => res.render('auth/info', {
      title: 'Verify Email',
      infoMessage: 'Congrats! Your account is now verified.',
    }));
  })
  .catch(next);
});

authRouter.get('/google',
  beforeAuthMiddleware,
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  afterAuthMiddleware);

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;
