const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');
// const { number } = require('easy-table');

var roleArr = [];
var deptArr = [];

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
        // for (let title of rows) {
        //     roleArr.push(title)
        // }
        for (let i = 0; i < rows.length; i++) {
            deptArr.push(rows[i].name);
        }
    })
    return deptArr;
};
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
}

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
    // inquirer prompts to get employee information
    // then pass that info to the database "INSERT into roles VALUES (the values we got)"
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the title of the new role?',
            validate: nameInput => {
                if (!nameInput) {
                    console.log('Please enter a last name!')
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
                if (isNaN(nameInput)) {
                    console.log("Invalid input");
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Select the department they will belong to'
        }
    ]).then(roleInfo => {
        const { role, salary, department_id } = roleInfo;
        const sql = `INSERT INTO role (title) VALUES ('${role}', ${salary}, ${department_id});`;
        const sql2 = `SELECT * FROM role;`;

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

const addEmp = () => {
    // WHEN I choose to add an employee
    // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    var choiceArr = getRoles();
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
            choices: choiceArr,
        },
        {
            type: 'input',
            name: 'manager',
            message: 'Select the manager they will work under. If none, press ENTER to continue.'
        }
    ]).then(empInfo => {
        const { first_name, last_name, role, manager } = empInfo;
        const sql = `INSERT INTO employee (title) VALUES ('${first_name}', '${last_name}', '${role}', ${manager});`;
        const sql2 = `SELECT * FROM role;`;

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

    // console.log(roleArr);

};

const updateEmpRole = () => {
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    // inquirer prompts to select employee, select role
    // send info back to database
    inquirer.prompt

};

init = () => {
    promptMenu();
}

init();