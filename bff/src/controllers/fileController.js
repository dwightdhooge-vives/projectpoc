import fetch, { Headers } from "node-fetch";

const requestOptions = (request) => {
    return {
        method: 'GET',
        headers: new Headers({
            "X-Redmine-API-Key": request.headers['api-key']
        }),
        redirect: 'follow',
    }
};

export const files = async (req, res) => {

    let allFiles = await getAllFiles(req);

    return res.json(allFiles);
}

export const folders = async (req, res) => {
    let allFolders = await getAllFolders(req);

    return res.json(allFolders);
}

async function getMainFolderContent(req) {
    const response = await fetch('https://projectwerk.vives.be/projects/' + req.params.projectID + '/dmsf.json', requestOptions(req))

    return response.json();
}

async function getSubFolderContent(req, id) {
    const response = await fetch('https://projectwerk.vives.be/projects/' + req.params.projectID + '/dmsf.json?folder_id=' + id, requestOptions(req))

    return response.json();
}

async function getFileDetail(req) {
    const response = await fetch('https://projectwerk.vives.be/dmsf/files/' + req.params.fileID + '.json', requestOptions(req))

    return response.json();
}


//Getting all files
async function getAllFiles(req) {
    let allFiles = [];

    var content = await getMainFolderContent(req)
    // When files present in Main Folder, add them to array
    if (filesPresent(content)) {
        console.log('There are files present')
        let files = filterFiles(content);
        for (const file of files) {
            console.log('adding file' + file.name)
            allFiles.push(file);
        }
    } else {
        console.log('No files present in this folder')
    }

    let allFolders = await getAllFolders(req);

    for (const folder of allFolders) {
        var folderContent = await getSubFolderContent(req, folder.id);

        if (filesPresent(folderContent)) {
            console.log('There are files present')
            let files = filterFiles(folderContent);
            for (const file of files) {
                console.log('adding file' + file.name)
                allFiles.push(file);
            }
        } else {
            console.log('No files present in folder' + folder.id)
        }
    }
    return allFiles;
}

//Getting all folders 
async function getAllFolders(req) {
    let allFolders = [];

    //Getting Main Folder Content
    var content = await getMainFolderContent(req)

    //Loop Through Folders 
    if (foldersPresent(content)) {

        let subFolders = filterFolders(content);
        // add subfolders to folders Array
        for (const subFolder of subFolders) {
            allFolders.push(subFolder);
        }
        // While there are subfolders, get content and check for more folders 
        while (subFolders.length !== 0) {
            let newSubFolders = [];

            for (const folder of subFolders) {
                var folderContent = await getSubFolderContent(req, folder.id);

                if (foldersPresent(folderContent)) {
                    console.log('There are folders in content')
                    let folders = filterFolders(folderContent);
                    for (const folder of folders) {
                        newSubFolders.push(folder);
                        allFolders.push(folder)
                    }
                } else {
                    console.log('no folders present anymore')
                }
            }
            subFolders = newSubFolders
        }
    } else {
        console.log('No folders left')
    }
    return allFolders;
}

//Check if folders are present in given data
function foldersPresent(data) {
    let folderArray = data.dmsf.dmsf_folders
    if (folderArray.length === 0) {
        return false;
    } else return true;
}

//Check if files are present in given data
function filesPresent(data) {
    let filesArray = data.dmsf.dmsf_files
    if (filesArray.length === 0) {
        return false;
    } else return true;
}

// filter Folders out of given folderData 
function filterFolders(folderData) {
    let allFolders = [];
    let folderArray = folderData.dmsf.dmsf_folders;

    folderArray.forEach(element => {
        allFolders.push(element)
    });
    return allFolders
}

// filter Files out of given folderData 
function filterFiles(folderData) {
    let allFiles = [];
    let filesArray = folderData.dmsf.dmsf_files;

    filesArray.forEach(element => {
        allFiles.push(element)
    });
    return allFiles
}