const inquirer = require('inquirer');
const db = require('./config/connection');

//arrays for inquirer choices
var roleArr = [];
var deptArr = [];
var empArr = [];
var managerArr = [];

//array-filling functions
const getRoles = () => {
    const roles = `SELECT title FROM role;`;
    db.query(roles, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            roleArr.push(rows[i].title);
        }
    })
    return roleArr;
};
roleArr = getRoles();

const getDepts = () => {
    const depts = `SELECT name, id FROM department;`;
    db.query(depts, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let name = rows[i].name;
            let id = rows[i].id;
            deptArr.push({ name, id });
        }
    }) 
    return deptArr;
};
deptArr = getDepts();

const getEmps = () => {
    const sql = 'SELECT first_name, last_name FROM employee;';
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let empName = rows[i].first_name + " " + rows[i].last_name;
            empArr.push(empName);
        }
    })
    return empArr;
};
empArr = getEmps();

const getManagers = () => {
    const query = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;
    db.query(query, (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name + " " + res[i].last_name);
        }
    });
    return managerArr;
};
managerArr = getManagers();

// main functions
const viewDepts = () => {
    const query = `SELECT * FROM department;`;

    db.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });

};

const viewRoles = () => {
    const query = `SELECT * FROM role`;

    db.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

const viewEmps = () => {
    const query = `SELECT * FROM employee`;

    db.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the new department?'
        }
    ]).then(deptTitle => {
        deptArr.push(deptTitle.name);
        const newName = deptTitle.dept;

        const query1 = `INSERT INTO department (name) VALUES ('${newName}');`;
        const query2 = `SELECT * FROM department;`;

        db.query(query1, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Successfully added new Department. Updated list:');
        });

        db.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Please enter a title!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter their salary as a number. (Do not include currency symbols.)',
            validate: function (nameInput) {
                if (isNaN(nameInput) || !nameInput) {
                    console.log("Invalid input");
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'department_name',
            message: 'Select the department this role will belong to.',
            choices: deptArr
        }
    ]).then(roleInfo => {
        
        const { title, salary, department_name } = roleInfo;
        roleArr.push(title);

        const query = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, (SELECT id FROM department WHERE name='${department_name}'));`;
        db.query(query, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully added new Role. Updated list:');
        });

        const query2 = `SELECT * FROM role;`;
        db.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

const addEmp = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the FIRST name of the employee.',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Please enter a first name!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the LAST name of the employee.',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Please enter a last name!')
                    return false;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select their role in the company.',
            choices: roleArr,
        },
        {
            type: 'list',
            name: 'managerName',
            message: 'Select the manager they will work under.',
            choices: managerArr
        }
    ]).then(empInfo => {
        const { first_name, last_name, role, managerName } = empInfo;
        
        const manager_first_name = managerName.split(' ')[0];
        const manager_last_name = managerName.split(' ')[1];
        
        const sql = `SELECT id FROM employee WHERE first_name='${manager_first_name}' AND last_name='${manager_last_name}';`

        var empName = empInfo.first_name + " " + empInfo.last_name;
        empArr.push(empName);

        db.promise().query(sql).then((rows) => {
            const manager_id = rows[0][0].id;
            return manager_id;
        })
        .then(manager_id => {
            const sql2 = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', (SELECT id FROM role WHERE title='${role}'), ${manager_id});`;
            db.query(sql2, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Successfully added new Role.');
            })             
        });
    })
};

const updateEmpRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeName',
            message: 'Select the employee to update.',
            choices: empArr
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Select their new role.',
            choices: roleArr
        }
    ]).then(updatedInfo => {
        const { employeeName, newRole } = updatedInfo;
        const emp_first_name = employeeName.split(' ')[0];
        const emp_last_name = employeeName.split(' ')[1];

        const query = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title='${newRole}') WHERE first_name='${emp_first_name}' AND last_name='${emp_last_name}';`;
        db.query(query, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully updated employee data. Updated list:');
        });

        const query2 = `SELECT * FROM employee;`;
        db.query(query2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

module.exports = {viewDepts, viewRoles, viewEmps, addDept, addRole, addEmp, updateEmpRole};