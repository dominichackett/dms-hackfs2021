import React,{useState,useContext} from 'react'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {   makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import logo from "./images/dms4.PNG";
import { UserContext } from './UserContext';
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { PrivateKey,Client,ThreadID,Users} from '@textile/hub'


const useStyles = makeStyles((theme) => ({
   
    largeIcon: {
      width: 250,
      height: 250,
    },
    walletIcon: {
      width: 180,
      height: 180,
      color: "#ffcc57",
    },
    root: {
      flexGrow: 1,
      paddingTop:"3em"
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
     backgroundColor:"#3b3b3b"
    },
    walletDiv: {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      cursor: "pointer",
      
     
    walletText: {
      "fontSize": "36px",
    "fontWeight": "600",
    color: "#ffcc57",
}
    },

    useCaseDiv: {
      display: "flex",
      "align-items": "center",
      "justify-content": "space-between"

    },
    useCaseText: {
      "fontSize": "22px",
    "fontWeight": "500",
    color: "#ffcc57",
    
    },
    
  appBarSpacer: theme.mixins.toolbar,
   logoDiv: {
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
  },
  useCaseText: {
    "fontSize": "42px",
  "fontWeight": "500",
  color: "#ffcc57",
  
  }
    
  }));

function CheckIn() 
{
  const classes = useStyles();
  const  uContext = useContext(UserContext);

  
  const [dialogSeverity,setDialogSeverity] = useState("success");
  const [messageDialogOpen,setMessageDialogOpen] = useState(false);
  const [dialogMessage,setDialogMessage] = useState("");
  const history = useHistory();
  
console.log(uContext.PrivateKey);
 if(uContext.idx.ceramic.did.authenticated != true)
 {
    history.push("/");
 }

 const handleDialogClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessageDialogOpen(false);
  };

  return(
    <div className={classes.root}>
                  {uContext != null && uContext?.identity?.public?.toString()}

            <Grid container spacing={1}>
        
        <Grid item xs={6} sm={4}>
         
        </Grid>
        <Grid item xs={6} sm={4}>
         <div className={classes.logoDiv}> <img src={logo} classNamee={classes.largeIcon} />
        </div>
        </Grid>
        <Grid item xs={6} sm={4}>
            </Grid>
        <Grid item xs={6} sm={4}>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper className={classes.paper} elevation={0}>   <div className={classes.walletDiv} >   
         <span className={classes.useCaseText}>Click Here To Check In </span> </div>
        </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
        </Grid>
        <Grid item xs={6} sm={4}>
        </Grid>
        <Grid item xs={6} sm={4}>
        </Grid>
        <Grid item xs={6} sm={4}>
        </Grid>
       
      </Grid>
      <Snackbar open={messageDialogOpen} autoHideDuration={10000} onClose={handleDialogClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleDialogClose} severity={dialogSeverity} elevation={6} variant="filled"> 
                {dialogMessage}
                </MuiAlert>
               </Snackbar> 
        </div>
    )
}

export default CheckIn
