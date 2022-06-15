INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Legal"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesman", 50000.00, 1),
       ("HR Rep", 45000.00, 4),
       ("Legal Consultant", 60000.00, 3),
       ("Junior Developer", 60000.00, 2),
       ("Senior Developer", 75000.00, 2),
       ("Sales Manager", 60000.00, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Janus", "Morgan", 1, 6),
       ("Daria", "Simms", 2, null),
       ("Damian", "Jennings", 3, null),
       ("Carla", "Thompson", 4, 5),
       ("Erin", "Jacobs", 5, null),
       ("May","Han", 6, null);