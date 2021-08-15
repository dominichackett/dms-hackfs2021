import React,{useState,useEffect,useContext,useRef} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {   makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useParams } from "react-router-dom";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { UserContext } from './UserContext';
import LockIcon from '@material-ui/icons/Lock';
import { PrivateKey,PublicKey} from '@textile/hub'
import InputLabel from '@material-ui/core/InputLabel';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import PageviewIcon from '@material-ui/icons/Pageview';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Web3 from 'web3';
import { DMS_ABI, DMS_CONTRACT } from './contract';

const useStyles = makeStyles((theme) => ({
   
    largeIcon: {
      width: 50,
      height: 50,
      "color":"rgba(255, 201, 5, 1)"

    },

    downloadIcon: {
      width: 50,
      height: 50,

    },
   
   
    root: {
        flexGrow: 1,
        paddingTop:"10px"
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'left',
        backgroundColor: "#487113",
        backgroundColor: "#284B63"

        
    },

    addressHeader: {
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        paddingBottom: "5px"
  
      },
      headerText: {
        "fontSize": "20px",
      "fontWeight": "500",
      "fontFamily": "'Gordita', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      "WebkitFontSmoothing": "antialiased",
      "lineHeight": "1.5",
      "color":"rgba(255, 201, 5, 1)"

      },     

      formCreate: 
      { backgroundColor: '#D9D9D9', 
      padding:"20px"
    },
    paperVault:
    {
        padding: "15px",
        textAlign: 'left',
        backgroundColor: "rgba(52, 67, 249, 0.15)",
        backgroundColor:"#D9D9D9",
        "border-radius": "10px",
       border: "1px solid rgb(0, 0, 0)"
    },
    avatar: {
        margin: theme.spacing(1),
        width: 100,
      height: 100,
      backgroundColor:  "rgb(255, 255, 255)",
      color:"black"
  
  
      },
      alias:
      {
       "fontSize": "20px",
       "fontWeight": "500",
       color:"black"
       
      },   

    vaultButtons:
    {
        display: "flex",
        "align-items": "center",
        "justify-content": "space-between",
        padding:"5px"
    },
    
    aliasDiv: 
    {
        "text-align": "right",
        marginRight: "5px"
        
    },

    viewButton:
    {
        padding:"5px"
    },
    filesDiv:

    {
        backgroundColor:"#E0E0E0",
        
        
    },
    
   fileText: 
   {
    "flex": "1",
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "padding": "80px",
    "borderWidth": "2px",
    "borderRadius": "2px",
    "borderColor": "#eeeeee",
    "borderStyle": "dashed",
    "backgroundColor": "#fafafa",
    "color": "#bdbdbd",
    "outline": "none",
    "transition": "border .24s ease-in-out",
    "fontSize": "30px",
    "fontWeight": "500",
    
   },
   listText:
   {
       color:"black"
   },
   error:{
       color:"#f44336"
   },

   tableHeader: {
    "fontSize": "20px",
  "fontWeight": "500",
  "fontFamily": "'Gordita', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  "WebkitFontSmoothing": "antialiased",
  "lineHeight": "1.5",
   },

   tableText: {
    "fontSize": "18px",
  "fontWeight": "500",
  "fontFamily": "'Gordita', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  "WebkitFontSmoothing": "antialiased",
  "lineHeight": "1.5",
   }


    
}));

const colourStyles = {
    
    backgroundColor:"red"
    
  };
function TrusteeVault(props) {
    const classes = useStyles();
    
    const [createSuccessMessage,setCreateSuccessMessage] = useState("");
    const [createError, setCreateError] = useState(false);
    const [createErrorMessage,setCreateErroMessage] = useState("");
    const [createSuccess, setCreateSuccess] = useState(false);
    const  uContext = useContext(UserContext);
    const {id} = useParams();
    const [isGettingVault,setIsGettingVault]  = useState(true);
    const [myVault,setMyVault] = useState(null);
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [filenames,setFileNames] = useState([]);
    const [inbox,setInbox] = useState(new Map());
    const [addressBook,setAddressBook] = useState(new Map());
    const [gotAddressBook,setGotAddressBook]  = useState();
    const [vaultId,setVaultId] = useState();
    const [vaultStatus,setVaultStatus]  = useState("Locked");
   

    //Get Inbox for current user
    useEffect(()=>{
        async function getTrusteeVault(vid)
        {
          setVaultId(vid);  
          if(uContext.db && uContext.threadid)
            {
                try
                { 
                   const vault = await uContext.db.findByID(uContext.threadid,"TrusteeVault",vid);
                  
                   setMyVault(vault);
                   setIsGettingVault(false);
                   
                   if(vault.privateKey != undefined && vault.privateKey != "" && vault.privateKey != null)
                   {
                      setVaultStatus("Open");
                      getFilesFromWeb3Storage(vault);
                   }

                }catch(e)
                {
                   
                   setVaultStatus("Locked");
                   setIsGettingVault(false);
                }
            }     
        } 

        async function getInbox()
        {
            
            // Grab all existing inbox messages and decrypt them locally
            const messages = await uContext.user.listInboxMessages();
            const _inbox = new Map();
            for (const message of messages) {
              const bytes = await uContext.privateKey.decrypt(message.body);
              const body = new TextDecoder().decode(bytes);
              const {from} = message
              const {createdAt} = message
              const obj = {id:message.id,from:(addressBook[from] ? addressBook[from].alias : "Anonymous")
                          ,vault:JSON.parse(body),createdAt:createdAt};

             console.log(obj);    
             _inbox[message.id]= obj;  

             if(message.id == id) //use message id to get the vault
               getTrusteeVault(obj.vault.vault); 
            }
            setInbox(_inbox);
        }

       
        if(gotAddressBook)
        {
            getInbox();
        }

    },[gotAddressBook,vaultStatus]);
  
//Get Address Book Data
useEffect(()=>{
    async function getAddressBookData()
    {
        var aBook =  new Map();
       if(uContext.db && uContext.threadid)
       { 
          const found = await uContext.db.find(uContext.threadid, "AddressBook", {});
          //var options = found.map(obj => ({value:obj._id,label:obj.alias}));
          found.forEach(function(obj){
             aBook[obj._id]   =   {value:obj._id,alias:obj.alias}; 
          });

          setAddressBook(aBook);
          setGotAddressBook(true);
       }
    }
   

    getAddressBookData();
},[uContext.db]); 


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



    
    
      async function getFilesFromWeb3Storage(vault)
      {
        console.log(vault)
        const privatekey = PrivateKey.fromString(vault.privateKey);
        const storage  =  new Web3Storage({ token:process.env.REACT_APP_WEB3_STORAGE_KEY });
        const res = await storage.get(vault.cid);
        if (!res.ok) {
         setCreateErroMessage("Error Downloading Encrypted Files From We3.Storage");
         setCreateError(true);
         return;
        }

        const web3Files = await res.files()
        console.log(web3Files);
        const links = [];
        const fnames = [];
        for (const file of web3Files) {
          console.log(file);
          console.log(`${file.cid} ${file.name} ${file.size}`)
          const filedata = await file.arrayBuffer();
           
          console.log(new Uint8Array(filedata));
          console.log(await privatekey.decrypt(new Uint8Array(filedata)))
           // this part avoids memory leaks
           //if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink)

          const data = await privatekey.decrypt(new Uint8Array(filedata));
          // update the download link state
          links.push(window.URL.createObjectURL(new Blob([data])));
          fnames.push(file.name);
        }

        setFileNames(fnames);
        setDownloadLinks(links);


      }


      async function handleUnlockVault(){
     
        const accounts = await window.ethereum.enable();
        let web3 = new Web3(window.ethereum);
        let dmsContract = new web3.eth.Contract(DMS_ABI,DMS_CONTRACT);
        console.log(vaultId);
        console.log(uContext.privateKey.public.toString())
        /*dmsContract.methods.getVaultKey(vaultId,uContext.privateKey.public.toString()).send({from:accounts[0]})
        .on('receipt', function(receipt){
          console.log(receipt);
          setCreateSuccessMessage("We got the key");
          setCreateSuccess(true);      
        }).on('error', function(error, receipt) {
          setCreateErroMessage("The Vault Is Still Lccked. Cannot Unlock Vault"+error.message);
          setCreateError(true);
  
      });*/

        dmsContract.methods.getVaultKey(vaultId,uContext.privateKey.public.toString()).call({from:accounts[0]})
             .then( function(receipt){
           console.log(receipt)
           setCreateSuccessMessage("We got the Key 2");
          setCreateSuccess(true);
          upDateVault(receipt);
                       
             }).catch(function(error, receipt) { 
               setCreateErroMessage("The Vault Is Still Lccked. Cannot Unlock Vault");
               setCreateError(true);
           
             });    
               
   
     }
   

      async function upDateVault(key)
      {
        const myVault = inbox[id].vault;
        const bytes = await uContext.privateKey.decrypt(new Uint8Array(key.split(",")));
       
       const decryptedKey = new TextDecoder().decode(bytes);
       console.log(decryptedKey)
       console.log(uContext.privateKey.decrypt(new Uint8Array(key.split(",")))) 
       console.log(myVault)

       const _vault = {_id:myVault.vault,alias:myVault.name,privateKey:decryptedKey,cid:myVault.cid};
       console.log(_vault)
     
  uContext.db.create(uContext.threadid,'TrusteeVault',[_vault])
        .then(function(record){
           
            setCreateSuccessMessage("Your Vault Has Been Updated");
            setCreateSuccess(true);
            setVaultStatus("Open");
         })
        .catch(function(err){
            setCreateErroMessage("Error Updating Your Vault");
            
            setCreateError(true);
        });

      }

     

   

      
    return (
        <div className={classes.root}>

        <Grid item xs={12} sm={12}>
             <Paper className={classes.paper}><div className={classes.addressHeader}>
             <span className={classes.headerText}>Trustee Vault</span> <LockIcon className={classes.largeIcon}/></div>
             <div className={classes.formCreate}  >
          <Grid container spacing={3}>
        
          <Grid item xs={12} sm={12}>
          <InputLabel id="demo-simple-select-label">From</InputLabel>
          <span className={classes.tableText}>{inbox[id]?.from}</span>
           
            </Grid>

          <Grid item xs={12} sm={12}>
          <InputLabel id="demo-simple-select-label">Vault Name</InputLabel>
          <span className={classes.tableText}>{(inbox[id]?.vault.name ? inbox[id]?.vault.name : "Encrypted Vault") }</span>

           
            </Grid>

            <Grid item xs={12} sm={12}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <span className={classes.tableText}>{vaultStatus}</span>
           
            </Grid>
            <Grid item xs={6}>
            <Button
            fullWidth
            variant="contained"
            color="secondary"
            disabled={isGettingVault || vaultStatus=="Open"}
            onClick={() => handleUnlockVault()}

           >
           Unlock Vault
          </Button>
         </Grid>
           
            <Grid item xs={12} sm={6}>
            </Grid>

      
           </Grid>
          <Grid container justify="flex-end">
            <Grid item>
            
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
            </Grid>
          </Grid>
          
      </div>   

      </Paper>
      </Grid>
           <Grid item xs={12} sm={12}>
             <Paper className={classes.paper}><div className={classes.addressHeader}>
             <span className={classes.headerText}>View Vault Files</span> <PageviewIcon className={classes.largeIcon}/></div>
             <div className={classes.formCreate}  >
             <TableContainer className={classes.container}>
    
    <Table stickyHeader  aria-label="customized table">
      <TableHead style={{ backgroundColor: 'blue' }}>
        <TableRow>
        <TableCell><span className={classes.tableHeader}>File Name</span></TableCell>
          <TableCell  align="right"><span className={classes.tableHeader}>Download</span></TableCell>
      
        </TableRow>
      </TableHead>
      <TableBody>
      

             {downloadLinks.map((row,index) => (
            <TableRow key={row.date} className={classes.tableRow}>
            <TableCell  >
             <span  className={classes.tableCellSecondary}> 
            <span className={classes.tableText}>{filenames[index]}</span> 

             </span>
            </TableCell>
            <TableCell align="right">
            <a
          // this attribute sets the filename
          download={filenames[index]}
          // link to the download URL
          href={downloadLinks[index]}
          target="_blank"
        >
          <CloudDownloadIcon className={classes.downloadIcon}/>

        </a>
      
            </TableCell>
      </TableRow>      

            ))}
     </TableBody>
        </Table>
       </TableContainer> 
     </div>
    </Paper>
</Grid>    
     </div>        
    )
}

export default TrusteeVault
