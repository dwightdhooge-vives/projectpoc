import e from "express";
import fetch, { Headers } from "node-fetch";

const requestOptions = (request) => {
    return {
        method: 'GET',
        headers: new Headers({
            "X-Redmine-API-Key": request.headers['api_key']
        }),
        redirect: 'follow'
    }
};


export const getProjects = (req, res) => {
    fetch('https://projectwerk.vives.be/projects.json', requestOptions(req))
        .then(resp => {
            return resp.json()
        })
        .then((data) => {
            console.log(data)
            res.json(data);
        })
}

export const getProjectWithID = (req, res) => {
    fetch('https://projectwerk.vives.be/projects/' + req.params.projectID + '.json', requestOptions(req))
        .then(resp => {
            return resp.json()
        })
        .then((data) => {
            res.json(data);
        })
}

export const getProjectMembers = (req, res) => {

    fetch('https://projectwerk.vives.be/projects/' + req.params.projectID + '/memberships.json', requestOptions(req))
        .then(resp => {
            return resp.json();
        })
        .then((json) => 
        {
            if(req.query.role === undefined){
                console.log("No qeury params found");
                return json;
            }
            else {
                console.log("qeury params found");
                let members = json.memberships.filter(
                    eachObj => eachObj.roles.some(({name}) => name === req.query.role
                    ));
                    
                    console.log(members)
                
                return members
            }
        })
        .then((data) => {
            return res.json(data)
        })
}



