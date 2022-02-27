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
import ReactDOM from 'react-dom';

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
    const[data, setData] = useState(null);
  
    useEffect(() => {
      fetch("/projects", requestOptions)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
    }, []);
 
    if (data) {
      return (
        <div>
         <Project projects={data.projects} />
        </div>
      )
    }
    return null;
 }

 function Project({projects}) {
  return (
  <ul>
    {projects.map(project => (
      <div key={project.id}>
      <h1>{project.id} {project.name} </h1>
      <h2>{project.description}</h2>
      </div>
      
      //  <h1> {projects.id} {projects.name} </h1>
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
    </div>
  );
}