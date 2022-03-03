
// node.js example
import path from 'path'
import git from "isomorphic-git";
import http from "isomorphic-git/http/node/index.cjs";
import fs from 'fs'

// const dir = path.join(process.cwd(), 'testRepo2')

const dir = "../../resources/git/repo"

async function getRepo() {
    let repo = await git.clone({
        fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: 'master', singleBranch: true,
        onAuth: () => ({
            headers: {
                'Authorization': 'Basic ' + Buffer.from('dwight.dhooge:zt&urGT427p7FNGN', 'utf-8').toString('base64'),
            }
        })
    });
}

async function pullRepo() {
    let repo2 = await git.pull({
        fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: 'master', author: {
            name: "Dwight D'Hooge",
            email: 'dwight.dhooge@student.vives.be'
        },
        onAuth: () => ({
            headers: {
                'Authorization': 'Basic ' + Buffer.from('dwight.dhooge:zt&urGT427p7FNGN', 'utf-8').toString('base64'),
            }
        })
    });
}


async function ReadCommits(branch, amount) {
    let commits = await git.log({ fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', ref: branch, depth: Number(amount) })
    commits.map(s => console.log(s.commit));

    return commits;
}

async function getRemoteBranches() {
    let branches = await git.listBranches({ fs, http, dir, url: 'https://dwight.dhooge@projectwerk.vives.be/projectwerk.git', remote: 'origin' })
    return branches;
}

export const getBranches = (req, res) => {
    console.log('getting repo')
    rmGitDir()
    getRepo().
        then(test => pullRepo())
        .then(test => getRemoteBranches())
        .then((data) => {
            console.log(data)
            res.json(data);
        })
    rmGitDir()
}


export const getLatestCommits = (req, res) => {
    getRepo().
        then(test => pullRepo())
        .then(test => getRemoteBranches())
        .then(test => ReadCommits(req.query.branch, req.query.amount))
        .then((data) => {
            res.json(data);
        })
}

function rmGitDir() {
    console.log(dir)
    fs.rmSync(dir, { recursive: true, force: true }, console.log("Dir removed"));
}