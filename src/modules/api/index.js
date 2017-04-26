import express from 'express';

import appApi from './appApi';

const api = express.Router();

api.use('/apps', appApi);

module.exports = api;
