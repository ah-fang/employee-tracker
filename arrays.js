const db = require('./config/connection');
const cTable = require('console.table');

const department_name = 'Accounting';
const sql = `SELECT id FROM department WHERE name='${department_name}';`

const getDeptId = () => {
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data[0].id)
        return data;
    });
}
const department_id = getDeptId();

// var empArr = [];
// var roleArr = [];

// const getEmps = () => {
//     const sql = 'SELECT first_name, last_name, id FROM employee;';
//     db.query(sql, (err, rows) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         for (let i = 0; i < rows.length; i++) {
//             let empName = rows[i].first_name + " " + rows[i].last_name;
//             let empId = rows[i].id;
//             empArr.push({ empName, empId });
//         }
//         // console.log(empArr);
//     })
//     return empArr;
// }
// empArr = getEmps();

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
        // console.log(roleArr);
    })
    return roleArr;
};
// roleArr = getRoles();

// module.exports = { empArr, roleArr };

