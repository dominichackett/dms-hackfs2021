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
import { PrivateKey,Client,ThreadID} from '@textile/hub'

const KEY = 'kjzl6cwe1jw147nm36ho3uaiki0fm20tp38n53x6jf0ra345qatoyig1cu9wdag'

const useStyles = makeStyles((theme) => ({
   
    largeIcon: {
      width: 250,
      height: 250,
    },
    walletIcon: {
      width: 80,
      height: 80,
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
      "fontSize": "26px",
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
  }
    
  }));

function LandingPage() 
{
  const classes = useStyles();
  const  uContext = useContext(UserContext);

  
  const [dialogSeverity,setDialogSeverity] = useState("success");
  const [messageDialogOpen,setMessageDialogOpen] = useState(false);
  const [dialogMessage,setDialogMessage] = useState("");
  const history = useHistory();
  const info = {
    key: process.env.REACT_APP_KEY,
    secret:  process.env.REACT_APP_SECRET
  }

  const connectWallet = async () => {
    console.log(uContext.value);
    const addresses = await window.ethereum.enable();
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0])
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    uContext.value.did.setProvider(provider);
    await uContext.value.did.authenticate();
    const client =  await Client.withKeyInfo(info);
    uContext.setDb(client);  
   // await uContext.idx.remove(KEY);
    const jwe = await uContext.idx.get(KEY); //Get Stored Private Key to use with ceramic
    const pk = jwe ? await uContext.idx.ceramic.did.decryptJWE(jwe) : null;  //decryp private key 
    let identity;

        // Define an AddressBook schema
const schemaAddressBook = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'AddressBook',
  type: 'object',
  properties: {
    _id: { type: 'string' }, //Public Key is _id
    alias:{type: 'string'}   //Person or entity associated with the public key
    
  },
}

const schemaVault = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Vault',
  type: 'object',
  properties: {
    _id: { type: 'string' },   //Public Key is the id
    privateKey: { type: 'string' },
    alias:{type: 'string'},
    cid:{type:string},
    trustee:{type:'array'} //Public Keys of the trustees comes from address book
    
  },
}




    if(pk != null)
    {

      var string = new TextDecoder().decode(pk);

      console.log(string);
      identity = PrivateKey.fromString(string);
      uContext.setPrivateKey(identity);
      await client.getToken(identity);
      const threads = await client.listThreads();
      console.log(ThreadID.fromString(threads[0].id));
      uContext.setThreadid(ThreadID.fromString(threads[0].id));

    }
    else
    {
       
      identity = await PrivateKey.fromRandom();
       const identityString = identity.toString();
       console.log(uContext.idx);
       var uint8array = new TextEncoder().encode(identityString);

       const jwe = await uContext.idx.ceramic.did.createJWE(uint8array, [uContext.idx.ceramic.did.id]);
       await uContext.idx.set(KEY, jwe);
       uContext.setPrivateKey(identity);
       await client.getToken(identity);
       const threadID = await client.newDB();
       uContext.setThreadid(threadID);
       await client.newCollection(threadID, {name: 'AddressBook', schema: schemaAddressBook});
       await client.newCollection(threadID, {name: 'Vault', schema: schemaVault});
      


    }


   
  };  

  const handleDialogClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setMessageDialogOpen(false);
  };
console.log(uContext.PrivateKey);
 if(uContext.idx.ceramic.did.authenticated == true)
 {
    history.push("/vaults");
 }

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
        <Grid item xs={6} sm={4}>
          <Paper className={classes.paper} elevation={0}>   <div className={classes.walletDiv} onClick={connectWallet}>         <AccountBalanceWalletIcon className={classes.walletIcon}/>
         <span className={classes.useCaseText}> Connect Wallet </span> </div>
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

export default LandingPage
