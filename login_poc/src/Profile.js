import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

var myHeaders = new Headers();
myHeaders.append("api_key", localStorage.getItem('api_key'));

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

export default function Profile() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("api_key");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  function ProjectList() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/projects", requestOptions)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, []);

    if (data) {
      return (
        <div>
          <h1>List of projects of logged in Supervisor</h1>

          <Project projects={data.projects} />
        </div>
      )
    }
    return null;
  }

  function GitBranchesList() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/git/branches", {
        method: 'GET',
        headers: {
          //Authorizing 
          'Authorization': localStorage.getItem('Authorization'),
        },
      })
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, []);

    if (data) {
      return (
        <div>
          <h2>Available branches are</h2>
          <ul>
            {data.map((branch,index) => (
              <li key={index}>{branch}</li>
            ))}
          </ul>
        </div>
      )
    }
    return null;
  }

  function GitCommitList({branch, amount}) {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/git/commits?branch=" + branch + "&amount=" + amount, {
        method: 'GET',
        headers: {
          //Authorizing 
          'Authorization': localStorage.getItem('Authorization'),
        },
      })
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, []);

    if (data) {
      return (
        <div>
          <h2>Latest Commits: </h2>
          <ul>
            {data.map(cmt => (
              <li key={cmt.oid}>{cmt.commit.message} from {cmt.commit.author.name} </li>
            ))}
          </ul>
        </div>
      )
    }
    return null;
  }

  function FilesList({ projectID }) {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/projects/" + projectID +"/dmsf/files", requestOptions)
        .then(res => res.json())
        .then(setData)
        .catch(console.error);
    }, []);

    if (data) {
      return (
        <div>
          <h2>Added Files </h2>
          <ul>
            {data.map(file => (
              <li key={file.id}>{file.id} : {file.name} </li>
            ))}
          </ul>
        </div>
      )
    }
    return null;
  }



  function Project({ projects }) {
    return (
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <h3>{project.id} {project.name} </h3>
            <p><em>{project.description}</em></p>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Profile
          </Typography>
          <div>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar src={user.avatar} />
            </IconButton>
            <Menu id="menu-appbar"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography variant="h5">
            Welcome {user.firstname} {user.lastname}
          </Typography>
        </CardContent>
      </Card>
        <ProjectList></ProjectList>
        <h1>GIT info:</h1>
        <GitBranchesList></GitBranchesList>
        <GitCommitList branch={"master"} amount={5}></GitCommitList>
        <h1>DMSF info:</h1>
        <FilesList projectID={265}></FilesList>
    </div>
  );
}