const db = require('./config/connection');

var roleArr = [];
const getRoles = () => {
    const roles = `SELECT title FROM role;`;
    db.query(roles, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        // for (let title of rows) {
        //     roleArr.push(title)
        // }
        for (let i = 0; i < rows.length; i++) {
            roleArr.push(rows[i].title);
        }
    })
    return roleArr;
};
const choices = getRoles();
console.log("Choices are: ");
console.log(choices);

module.exports = getRoles;