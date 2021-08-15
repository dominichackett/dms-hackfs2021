import React,{useState,useContext,useEffect} from 'react'
import {   makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from "react-router-dom";
import logo from "./images/dms4.PNG";
import { UserContext } from './UserContext';
import { format} from 'date-fns';
import { Button } from '@material-ui/core';
import { Query} from '@textile/hub'
import Web3 from 'web3';
import { DMS_ABI, DMS_CONTRACT } from './contract';

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
    
  appBarSpacer: theme.mixins.toolbar,
   logoDiv: {
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
  },
  useCaseText: {
    "fontSize": "26px",
  "fontWeight": "500",
  
  
  },
  dateText: {
    "fontSize": "18px",
  "fontWeight": "500",
  color: "white",
  marginLeft:"15px"
  },
  dateLabel: {
    "fontSize": "18px",
  "fontWeight": "500",
  color: "#ffcc57",
  
  
  },
  lifeButton:
  {
      backgroundColor:"#ffcc57"
  }


    
  }));

function CheckIn() 
{
  const classes = useStyles();
  const  uContext = useContext(UserContext);

  
  
  const [lastSeen, setLastSeen]  = useState();
  const history = useHistory();
  const [createSuccessMessage,setCreateSuccessMessage] = useState("");
  const [createError, setCreateError] = useState(false);
  const [createErrorMessage,setCreateErroMessage] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  
 if(uContext.idx.ceramic.did.authenticated != true)
 {
    history.push("/");
 }

 const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCreateSuccess(false);
  };

  const handleCreateErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setCreateError(false);
  };


  async function handleCheckIn(){
     
     const accounts = await window.ethereum.enable();
     let web3 = new Web3(window.ethereum);
     let dmsContract = new web3.eth.Contract(DMS_ABI,DMS_CONTRACT);
     dmsContract.methods.checkIn().send({from:accounts[0],gasLimit:30000})
          .on('receipt', function(receipt){
        
            const seen = new Date().getTime();  
            uContext.db.create(uContext.threadid,'LastSeen',[{_id:seen.toString()}])
            .then(function(record){
               
           
                setCreateSuccessMessage("Check In Was Successful");
                setCreateSuccess(true);
                setLastSeen(seen);
            })
            .catch(function(err){
                setCreateErroMessage("Error Saving Check In ");
                setCreateError(true);
          
            });
       
          }).on('error', function(error, receipt) { 
            setCreateErroMessage("Error Checking In. Your Did Not Send Any Vaults To Any Trustees");
            setCreateError(true);
        
          });    


  }

//Get Last Seen
useEffect(()=>{
    async function getLastSeen()
    {
       console.log(uContext.db)
       if(uContext.db && uContext.threadid)
       { 
          const query = new Query().orderByDesc("_id");
          query.limit = 1;
          try{
          const found = await uContext.db.find(uContext.threadid, "LastSeen", query);
          setLastSeen(found[0]._id);
          }catch(e)
          {
          
          }
       }
    }
    getLastSeen();
},[uContext.db,uContext.threadid]);


  return(
    <div className={classes.root}>
                
            <Grid container spacing={1}>
        
                <Grid item  sm={12}>
         <div className={classes.logoDiv}>       
 <img src={logo} classNamee={classes.largeIcon} />
        </div>
        </Grid>
        
        <Grid item  sm={12}>
          <div className={classes.walletDiv} >   
         <Button variant="contained" onClick={() => handleCheckIn()}
           className={classes.lifeButton}><span className={classes.useCaseText}>Click Here To Provide Proof Of Life</span></Button> 
          </div>
         
       
            </Grid>
          
            <Grid item sm={12}>
        <div className={classes.logoDiv}>       
   
         <span className={classes.dateLabel}>Last Seen: </span> <span className={classes.dateText}>{(lastSeen ? format(parseInt(lastSeen),"iii do MMMM yyyy p") : "--------")} </span>
</div>         
    
        </Grid>
        
       
      </Grid>
      <Snackbar open={createSuccess} autoHideDuration={6000} onClose={handleSuccessClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleSuccessClose} severity="success" elevation={6} variant="filled"> 
                 {createSuccessMessage}
                </MuiAlert>
               </Snackbar>

               <Snackbar open={createError} autoHideDuration={6000} onClose={handleCreateErrorClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleCreateErrorClose} severity="error" elevation={6} variant="filled">
                  {createErrorMessage}
                </MuiAlert>
               </Snackbar>
            
      
        </div>
    )
}

export default CheckIn
