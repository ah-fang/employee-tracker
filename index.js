const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

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

const getDepts = () => {
    //generate and return an array of departments from the database
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

//manager selection
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

//prompt response functions 
const promptMenu = () => {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Employee Role'
                ]
            }
        ])
        .then(answer => {
            switch (answer.menu) {
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmps();
                    break;
                case 'Add a Department':
                    addDept();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmp();
                    break;
                case 'Update an Employee Role':
                    updateEmpRole();
                    break;
            }
        })
};

const viewDepts = () => {
    const sql = `SELECT * FROM department;`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });

};

const viewRoles = () => {
    const sql = `SELECT * FROM role`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
};

const viewEmps = () => {
    const sql = `SELECT * FROM employee`;

    db.query(sql, (err, rows) => {
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
        const sql = `INSERT INTO department (name) VALUES ('${newName}');`;
        const sql2 = `SELECT * FROM department;`;

        //first query - insert into the table
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Successfully added new Department. Updated list:');
        });

        // second query - return the updated table of departments
        db.query(sql2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);

        });
    })
};

const addRole = () => {
    deptArr = getDepts();

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

        const sql2 = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, (SELECT id FROM department WHERE name='${department_name}'));`;
        db.query(sql2, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully added new Role. Updated list:');
        });

        const sql3 = `SELECT * FROM role;`;
        db.query(sql3, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

const addEmp = () => {
    roleArr = getRoles();
    managerArr = getManagers();

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
    roleArr = getRoles(); 
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

        const sql2 = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title='${newRole}') WHERE first_name='${emp_first_name}' AND last_name='${emp_last_name}';`;
        db.query(sql2, (err) => {
            if (err) {
                console.log(err);
                console.log("Failed! Current list: ")
                return;
            }
            console.log('Successfully updated employee data. Updated list:');
        });

        const sql3 = `SELECT * FROM employee;`;
        db.query(sql3, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);
        });
    })
};

promptMenu();