import express from 'express';
import passport from 'passport';
import sequelize from 'sequelize';
import crypto from 'crypto';
import errors from 'throw.js';
import bcrypt from 'bcryptjs';
import aws from 'aws-sdk';
import nodemailer from 'nodemailer';

import User from '../../models/User';
import App from '../../models/App';
import Action from '../../models/Action';

import isEmail from '../../libs/isEmail';

const userApiRouter = express.Router();

const transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1',
  }),
});

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

userApiRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
  hmac.update(req.user.id);

  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      profilePicture: req.user.profilePicture,
      intercomUserHash: hmac.digest('hex'),
    },
  });
});

userApiRouter.patch('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body) {
    return next(new errors.BadRequest('bad_request'));
  }

  return User.findById(req.user.id)
    .then((user) => {
      const newAttributes = {};
      if (req.body.email) {
        newAttributes.email = req.body.email;
        newAttributes.isVerified = false;
      }
      if (req.body.displayName) newAttributes.displayName = req.body.displayName;

      return user.updateAttributes(newAttributes)
        .then(() => {
          const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
          hmac.update(user.id);

          res.json({
            user: {
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              profilePicture: user.profilePicture,
              intercomUserHash: hmac.digest('hex'),
            },
          });
        });
    });
});

userApiRouter.post('/', (req, res, next) => {
  if (!req.body) return next(new errors.BadRequest('bad_request'));

  if (!req.body.email || !req.body.password || !isEmail(req.body.email)) {
    return next(new errors.BadRequest('bad_request'));
  }

  if (req.body.password.length < 6) {
    return next(new errors.CustomError('bad_request', 'Password must have at least 6 characters.'));
  }

  return User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        return Promise.reject(new errors.CustomError('email_taken', 'The email is already taken.'));
      }

      return bcrypt.hash(req.body.password, 10);
    })
    .then(hash =>
      User.create({
        email: req.body.email,
        password: hash,
        isVerified: false,
      }),
    )
    .then((user) => {
      // sendVerificationEmail after signing up
      sendVerificationEmail(user);

      const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
      hmac.update(user.id);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          profilePicture: user.profilePicture,
          intercomUserHash: hmac.digest('hex'),
        },
      });
    })
    .then(() => next())
    .catch(next);
});

userApiRouter.patch('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body) {
    return next(new errors.BadRequest('bad_request'));
  }

  return User.findById(req.user.id)
    .then((user) => {
      const newAttributes = {};
      if (req.body.email) {
        newAttributes.email = req.body.email;
        newAttributes.isVerified = false;
      }
      if (req.body.displayName) newAttributes.displayName = req.body.displayName;

      return user.updateAttributes(newAttributes)
        .then(() => {
          const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
          hmac.update(user.id);

          res.json({
            user: {
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              profilePicture: user.profilePicture,
              intercomUserHash: hmac.digest('hex'),
            },
          });
        });
    });
});

userApiRouter.get('/apps', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  Action.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('appId')), 'appId'], 'createdAt'],
    where: { userId: req.user.id },
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  })
  .then((actions) => {
    const opts = {
      attributes: ['id', 'slug', 'name', 'url', 'version'],
      where: {
        isActive: true,
        id: {
          $in: actions.map(action => action.appId),
        },
      },
    };

    return App.findAndCountAll(opts)
      .then(({ rows, count }) => {
        const totalPage = Math.ceil(count / limit);

        if (currentPage > totalPage && currentPage > 1) throw new errors.NotFound();

        return res.json({
          apps: rows,
          totalPage,
        });
      })
      .catch(next);
  })
  .catch(next);
});

module.exports = userApiRouter;
