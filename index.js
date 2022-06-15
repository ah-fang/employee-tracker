const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

var roleArr = [];
var deptArr = [];
// array of tuples: first name, last name, and ID. Display only first name + last name.
// When that option is selected, return that id as the choice 
var empArr = [];
var nameArray = [];
var managerArr = [];
//array filling functions
const getRoles = () => {
    //generate and return an array of roles from the database

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

const getDepts = () => {
    //generate and return an array of departments from the database
    const depts = `SELECT name FROM department;`;
    db.query(depts, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            deptArr.push(rows[i].name);
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

//manager selection
const selectManager = () => {
    const query = `SELECT first_name, last_name FROM employees WHERE manager_id IS NULL`;
    db.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name);
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
        .then(menuChoice => {
            switch (menuChoice.menu) {
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
    // WHEN I choose to view all departments
    // THEN I am presented with a formatted table showing department names and department ids
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
    // WHEN I choose to view all roles
    // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
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
    // WHEN I choose to view all employees
    // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
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
    // WHEN I choose to add a department
    // THEN I am prompted to enter the name of the department and that department is added to the database
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the new department?'
        }
    ]).then(deptTitle => {
        //add to department array
        deptArr.push(deptTitle.name);

        const newName = deptTitle.dept;
        const sql = `INSERT INTO department (name) VALUES ('${newName}');`;
        const sql2 = `SELECT * FROM department;`;

        //first query - insert into the table
        db.query(sql, (err, rows) => {
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
    // WHEN I choose to add a role
    // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
    deptArr = getDepts();
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
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
        const { role, salary, department_name } = roleInfo;
        const sql = `SELECT id FROM department WHERE name='${department_name}';`

        const getDeptId = () => {
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(data[0].id)
                return data[0].id;
            });
        }
        const department_id = getDeptId();
        console.log("Outside function: department id is: ")
        console.log(department_id);
        
        const sql2 = `INSERT INTO role (title, salary, department_id) VALUES ('${role}', ${salary}, ${department_id});`;
        db.query(sql2, (err) => {
            if (err) {
                console.log(err);
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
    // WHEN I choose to add an employee
    // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    roleArr = getRoles();
    empArr = getEmps();
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
            name: 'manager',
            message: 'Select the manager they will work under. If none, ????.',
            choices: managerArr
        }
    ]).then(empInfo => {
        const { first_name, last_name, role, manager } = empInfo;
        const sql = `INSERT INTO employee (title) VALUES ('${first_name}', '${last_name}', '${role}', ${manager});`;
        const sql2 = `SELECT * FROM role;`;

        // add new employee to employees array
        var empName = empInfo.first_name + " " + empInfo.last_name;
        empArr.push(empName);

        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Successfully added new Role. Updated list:');
        });
        db.query(sql2, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.table(rows);

        });
    })
};

const updateEmpRole = () => {
    empArr = getEmps();
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    // inquirer prompts to select employee, select role
    // send info back to database
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select the employee to update.',
            choices: []
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Select their new role.',
            choices: []
        }
    ]).then()

};

init = () => {
    promptMenu();
}

init();