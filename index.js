/*
User Story:
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: 
view all departments, 
view all roles, 
view all employees, 
add a department, 
add a role,
add an employee, and 
update an employee role.

*/
const inquirer = require('inquirer');
const db = require('./config/connection');
const cTable = require('console.table');

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
        switch(menuChoice.menu) {
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
        const newName = deptTitle.dept;
        const sql = `INSERT INTO department (name) VALUES ('${newName}');`;
        const sql2 = `SELECT * FROM department;`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Successfully added new Department. Updated list:');
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

const addRole = () => {
    // WHEN I choose to add a role
    // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
    // inquirer prompts to get employee information
    // then pass that info to the database "INSERT into roles VALUES (the values we got)"
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the title of the new role?'
        }
    ]).then(roleTitle => {
        const newRole = roleTitle.role;
        const sql = `INSERT INTO role (title) VALUES ('${newRole}');`;
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
};

const updateEmpRole = () => {
    // WHEN I choose to update an employee role
    // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    // inquirer prompts to select employee, select role
    // send info back to database
};

init = () => {
    promptMenu();
}

init();