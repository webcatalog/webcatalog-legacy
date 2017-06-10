import bcrypt from 'bcryptjs';

const generateHashAsync = (password, salt = bcrypt.genSaltSync(10)) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (hashErr, hash) => {
      if (hashErr) {
        reject(hashErr);
        return;
      }

      resolve(hash, salt);
    });
  });

export default generateHashAsync;
