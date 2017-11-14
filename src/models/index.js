import Action from './action';
import App from './app';
import Draft from './draft';
import Session from './session';
import User from './user';

const syncModels = () =>
  Promise.resolve()
    .then(() => User.sync())
    .then(() => {
      App.User = App.belongsTo(User);
      Draft.User = Draft.belongsTo(User);

      return Promise.all([
        App.sync(),
        Draft.sync(),
      ]);
    })
    .then(() => {
      Action.App = Action.belongsTo(App);
      Action.User = Action.belongsTo(User);

      return Promise.all([
        Action.sync(),
        Session.sync(),
      ]);
    });

export default syncModels;
