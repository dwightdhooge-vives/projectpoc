
// node.js example
import git from "isomorphic-git";
import http from "isomorphic-git/http/node/index.cjs";
import fs from 'fs'

const dir = "../../resources/git/repo"

async function cloneRepo(req) {
    console.log('Cloning repo')
    let repo = await git.clone({
        fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: 'master', singleBranch: true,
        onAuth: () => ({
            headers: {
                'Authorization': 'Basic ' + req.headers["authorization"]
            }
        })
    });
}

async function pullRepo(req) {
    console.log('pulling the repo')
    let repo2 = await git.pull({
        fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: 'master', author: {
            name: "Dwight D'Hooge",
            email: 'dwight.dhooge@student.vives.be'
        },
        onAuth: () => ({
            headers: {
                'Authorization': 'Basic ' + req.headers["authorization"]
            }
        })
    });
}

async function ReadCommits(branch, amount) {
    console.log('read commits')
    let commits = await git.log({ fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: branch, depth: Number(amount) })
    // commits.map(s => console.log(s.commit));
    return commits;
}

async function getRemoteBranches() {
    let branches = await git.listBranches({ fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', remote: 'origin' })
    return branches;
}

export const getBranches = (req, res) => {
    rmGitDir()
    cloneRepo(req).
        then(test => cloneRepo(req))
        .then(test => getRemoteBranches())
        .then((data) => {
            res.json(data);
        })
    rmGitDir()
}


export const getLatestCommits = (req, res) => {
    rmGitDir()
    cloneRepo(req).
        then(test => pullRepo(req))
        .then(test => getRemoteBranches())
        .then(test => ReadCommits(req.query.branch, req.query.amount))
        .then((data) => {
            res.json(data);
        })
    rmGitDir()
}

function rmGitDir() {
    fs.rmSync(dir, { recursive: true, force: true }, console.log("Git Directory removed"));
}