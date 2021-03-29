const db = require("../db/index.js");

module.exports = {
    WhatWouldYouLikeToDo(){
        return [{
                type:"list",
                name:"action",
                message:"What would you like to do?\n",
                choices:[
                        "VIEW_DEPARTMENT",
                        "VIEW_ROLE",
                        "VIEW_EMPLOYEE",
                        "VIEW_EMPLOYEE_BY_MANAGER",
                        "ADD_EMPLOYEE",
                        "ADD_DEPARTMENT",
                        "ADD_ROLE",
                        "CHANGE_EMPLOYEEs_ROLE",
                        "CHANGE_EMPLOYEEs_MANAGER",
                        "REMOVE_EMPLOYEE",
                        "REMOVE_DEPARTMENT",
                        "REMOVE_ROLE",
                        "DEPARTMENT_BUDGET",
                        "QUIT"
                ]
        }];
    },
    askEmployeeQ(){
        return[{
            name: "firstName",
            type: "input",
            message: "What is the employees first name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employees last name?"
        },
        role(),
        assignManager()]
    },
    askRoleQ(){
        return[{
            name: "title",
            type: "input",
            message: "What is the role title?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the role salary?"
        },
        department()]
    },

    askDepartmentQ(){
        return[{
            name: "deptName",
            type: "input",
            message: "What is the name of Department?"
        }]
    },
    deleting(){
        return {
            type: "confirm",
            name: "answer",
            message: "If you delete any roles, departments or employees you might delete multiple employees associated to the action?"
        }
    },

    askForWhatManager(){
        return[currentManager()]
    },
   
    employeeRoleQ(){
        return[employee(),role()]
    },
    changeManager(){
        return[employee(),
            assignManager()]
    },
    departmentList(){
        return[department()]
    },
    roleList(){
        return[role()]
    },
    employeeList(){
        return[employee()]
    }
   

}
const currentManager = () =>{
    return {
        name: "manager",
        type: "rawlist",
        message: "What is the managers name?",
        choices: ()=>getManager()
    }
}
const employee = () =>{
    return {
        name:"emp",
        type: "rawlist",
        message: "Which employee?",
        choices: ()=>getEmp()
    }
}
const assignManager = () =>{
    return {
        name:"manager",
        type: "rawlist",
        message: "Which employee is there manager?",
        choices: ()=>getEmp()
    }
}

const role = () =>{
    return {
        name: "roleId",
        type: "rawlist",
        message: "What is the role?",
        choices: ()=>getRole()
    }
}

const department = () =>{
    return  {
        name: "id",
        type: "rawlist",
        message: "What is the department name?",
        choices: ()=>getDept()
    }
}

const getEmp = async() =>{
    let emp = await db.getAllTables("employee")
    let array = emp.map(({employee_id, first_name,last_name}) =>{
        return{
            name:`${first_name} ${last_name}`,
            value:employee_id
        }
    })
    array.push({
        name:`No Employee`,
        value: "null"
    })
    return array
}

const getRole = async() =>{
    let roles = await db.getAllTables("role");
    return roles.map(({id_role, title}) => {
       return{
           name:title,
           value:id_role
       }
    })
}

const getManager = async () =>{
    let manager = await db.getManager();
    
    return manager.map(({manager,manager_id}) => {
       return{
           name:manager,
           value:manager_id
       }
    })
}
const getDept = async() =>{
            
    let departments = await db.getAllTables("department");
    return departments.map(({department_id, department_name}) => {
       return{
           name:department_name,
           value:department_id
       }
    })
  
}