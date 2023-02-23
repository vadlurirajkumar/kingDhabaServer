const bcrypt = require("bcrypt")

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);}

    const comparePassword = async (pass, user) => {
        return await bcrypt.compare(pass, user);
      };

    module.exports = {hashPassword,comparePassword}
