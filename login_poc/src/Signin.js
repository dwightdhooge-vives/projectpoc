import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { Buffer } from 'buffer';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  logo: {
    backgroundImage: 'url(https://projectwerk.vives.be/themes/circle/images/logo.png)',
    backgroundSize: 'cover',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(credentials) {
  return fetch('/login', {
    method: 'GET',
    headers: {
      //Authorizing
      'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password, 'utf-8').toString('base64'),
    },
  }).then(response => {
    if(response.ok){
      localStorage.setItem('Authorization', Buffer.from(credentials.username + ':' + credentials.password, 'utf-8').toString('base64'))
      return response.json();
    }
    return Promise.reject(response);
  }).catch(e => {
    if(e.status === 401){
        console.log(e);
        return e;
    }
    // return Promise.reject(e.json());
})
}


export default function Signin() {
  const classes = useStyles();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {

    e.preventDefault();
    const response = await loginUser({
      username,
      password
    })
    if ('user' in response) {
      swal("Successful Login", "Welcome to our Supervisor Tool", "success", {
        buttons: false,
        timer: 2000,
      })
        .then(async (value) => {
          console.log("success")
          console.log(response.user)
          console.log(response.user.api_key)
          localStorage.setItem('api_key', response.user.api_key);
          localStorage.setItem('user', JSON.stringify(response.user));
          window.location.href = "/profile";
        });
    } else {
      console.log("login failed")
      swal("Failed", "Incorrect credentials", "error");
    }
  }

  return (
    <Grid container className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <img src="https://projectwerk.vives.be/themes/circle/images/logo.png" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              onChange={e => setUserName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}