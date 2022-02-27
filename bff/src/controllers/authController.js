import e from "express";
import fetch, { Headers } from "node-fetch";

export const getUser = (req, res) => {
    console.log(req.headers["authorization"]);
    fetch('https://projectwerk.vives.be/users/current.json', {
        method: 'GET',
        headers: {
          // 'Authorization': 'Basic ' + Buffer.from("dwight.dhooge:G@fS$1qRuB0u", 'utf-8').toString('base64')
          'Authorization': req.headers['authorization']
        }
    })
        .then(resp => {
            return resp.json()
        })
        .then((data) => {
            res.json(data);
        })
}



