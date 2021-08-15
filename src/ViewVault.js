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

import {useForm ,Controller, set } from "react-hook-form";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from './UserContext';
import LockIcon from '@material-ui/icons/Lock';
import { PrivateKey,PublicKey} from '@textile/hub'
import Dropzone from 'react-dropzone';
import {useDropzone} from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select'
import { ErrorMessage } from '@hookform/error-message';
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
function ViewVault(props) {
    const classes = useStyles();
    
    const [confirmDialogMessage,setConfirmDialogMessage] = useState("");
    const [confirmMessageDialogOpen,setConfirmMessageDialogOpen] = useState(false);
    const [submitLabel,setSubmitLabel] = useState("Upload");
    const [createSuccessMessage,setCreateSuccessMessage] = useState("");
    const [createError, setCreateError] = useState(false);
    const [createErrorMessage,setCreateErroMessage] = useState("");
    const [confirmDialogSeverity,setConfirmDialogSeverity] = useState("info");
    const [createSuccess, setCreateSuccess] = useState(false);
    const [selectedFiles,setSelectedFiles]  = useState();
    const [fileInfo,setFileInfo]  = useState();
    const [trustees,setTrustees] = useState([]);
    const  uContext = useContext(UserContext);
    const {id} = useParams();
    const [isGettingVault,setIsGettingVault]  = useState(true);
    const [filesUploaded,setFilesUploaded] = useState(false);
    const [myVault,setMyVault] = useState(null);
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [filenames,setFileNames] = useState([]);
    const [sentToTrustees,setSentToTrustees] = useState(false);
    const action = useRef();
    const [dialogSeverity,setDialogSeverity] = useState("success");
    const [messageDialogOpen,setMessageDialogOpen] = useState(false);
    const [dialogMessage,setDialogMessage] = useState("");
   
   
    //Get Address Book Data
     useEffect(()=>{
        async function getAddressBookData()
        {
           console.log(uContext.db)
          
           if(uContext.db && uContext.threadid)
           { 
              const found = await uContext.db.find(uContext.threadid, "AddressBook", {});
              console.log(found);
              var options = found.map(obj => ({value:obj._id,label:obj.alias}));
              setTrustees(options);
              console.log(options)
           }
        }

       async function getVault()
           {
               if(uContext.db && uContext.threadid)
               {

               
                  const vault = await uContext.db.findByID(uContext.threadid,"Vault",id);
                  if(vault)
                  {
                      setIsGettingVault(false);  
                      setValue("alias",vault.alias);
                      setValue("trustees",vault.trustees);
                      setMyVault(vault);
                      console.log(vault);
                      if(vault.cid != undefined && vault.cid != "" && vault.cid != null)
                      {
                          setFilesUploaded(true);
                          getFilesFromWeb3Storage(vault);
                      }

                      if(vault.sent != undefined && vault.sent !="" && vault.sent != null)
                      {
                         setSentToTrustees(true);
                      }
                  }
              } 
           }
       
        getVault();
        getAddressBookData();
    },[uContext.db,filesUploaded]); 
   
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



    const {reset,getValues,setValue,control,handleSubmit,formState: { errors }} = useForm({defaultValues:{
        trustees: "",
        alias:""
      }});
    const _handleSubmit = (data,e) => {
        console.log(selectedFiles)
        if(selectedFiles == null)
        {
           setCreateErroMessage("Error No Files Selected For Upload");
           setCreateError(true);    
           return;
        
        }
        
         
        setConfirmDialogMessage(`Upload Files and Lock This Vault? `);
        action.current = "Upload";
        setConfirmDialogSeverity("info");
        setConfirmMessageDialogOpen(true);  
      
       
      };

     
      async function getAsByteArray(file) {
        return new Uint8Array(await readFile(file))
      }

      function readFile(file) {
        return new Promise((resolve, reject) => {
          // Create file reader
          let reader = new FileReader()
          // Register event listeners
          reader.addEventListener("loadend", e => resolve(e.target.result))
          reader.addEventListener("error", reject)
          // Read file
          reader.readAsArrayBuffer(file)
        })
      }

      async function encryptFiles()
      {
          
          var filesToUpload = [];
          const publickey =  PublicKey.fromString(myVault._id); // Vault ID is Public Key
          const privatekey = PrivateKey.fromString(myVault.privateKey);
          for (const file of selectedFiles) //Get Selected File Data
          {
               const byteFile = await getAsByteArray(file);
              // console.log(byteFile);

               const data = await publickey.encrypt(byteFile);  //Encrypt File with Public Key
             //  console.log(data);
              // console.log(await privatekey.decrypt(data));
               const f = new File([data], file.name, {
                
              });         
            
              console.log(new Blob(data))
              filesToUpload.push(f) ; 
            }
                
           upLoadFiles(filesToUpload);
           
      }

      async function upLoadFiles(data)
      {
        setDialogMessage("Uploading Files Please Wait");
        setDialogSeverity("info");
        setMessageDialogOpen(true);
       
         const storage  =  new Web3Storage({ token:process.env.REACT_APP_WEB3_STORAGE_KEY });
         const cid = await storage.put(data);
         upDateVault(cid);
  
      }
   

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


      async function sendVault()
      {
          
        const accounts = await window.ethereum.enable();
        let web3 = new Web3(window.ethereum);
        let dmsContract = new web3.eth.Contract(DMS_ABI,DMS_CONTRACT);
        let keys = [];
        let _trustees = [];
        
         const msg = {vault:myVault._id,cid:myVault.cid,name:myVault.alias};
         for(const value of myVault.trustees)
         
          {
            const encoded = new TextEncoder().encode(JSON.stringify(msg));
            const identity = PublicKey.fromString(value.value);

          
            const key = new TextEncoder().encode(myVault.privateKey); 
            const encryptedKey = await identity.encrypt(key); //Encrypt Vault's private key with trustee's public key
            _trustees.push(value.value);  //Public Key to identify trustee
            keys.push(encryptedKey.toString());
            uContext.user.sendMessage(uContext.privateKey, identity, encoded);
            var string = new TextDecoder().decode(encryptedKey);
            console.log(encryptedKey.toString())

          }
          console.log(_trustees)
          console.log(keys)
          //Duration set for day
          const duration = parseInt(myVault.checkInInterval)*86400;

           
        console.log(_trustees)
        setDialogMessage("Awaiting User Approval and Confirmations");
        setDialogSeverity("info");
        setMessageDialogOpen(true);
       
             dmsContract.methods.createVault(_trustees,myVault._id,keys,duration.toString()).send({from:accounts[0],gasLimit:3000000})
          .on('receipt', function(receipt){
            uContext.db.save(uContext.threadid,'Vault',[{_id:myVault._id,alias:myVault.alias,trustees:myVault.trustees,cid:myVault.cid,checkInInterval:myVault.checkInInterval,privateKey:myVault.privateKey,sent:true}])
            .then(function(record){
               
                setCreateSuccessMessage("Your Vault Has Been Sent To Your Trustee(s)");
                setCreateSuccess(true);
                //setRefreshVault(new Date());
              
                setSentToTrustees(true);
              })
            .catch(function(err){
                setCreateErroMessage("Error Updating Your Vault"+err.message);
                
                setCreateError(true);
            });
      
          }).on('error', function(error, receipt) { 
            setCreateErroMessage("Error Send Your Vault"+error.message);
                
            setCreateError(true);
          });    

            
      }

      const handleSendToTrustees = (data) => {
        setConfirmDialogMessage(`Do You Want To Send This Vault To The Trustees? `);
        action.current = "Send";
        setConfirmDialogSeverity("info");
        setConfirmMessageDialogOpen(true);

      
    }



      function upDateVault(cid)
      {
        uContext.db.save(uContext.threadid,'Vault',[{_id:myVault._id,alias:getValues('alias'),trustees:getValues('trustees'),cid:cid,checkInInterval:parseInt(getValues('checkInInterval')),privateKey:myVault.privateKey}])
        .then(function(record){
           
            setCreateSuccessMessage("Your Vault Has Been Updated");
            setCreateSuccess(true);
            //setRefreshVault(new Date());
          //  getFilesFromWeb3Storage(record);
            setFilesUploaded(true);
            reset();
        })
        .catch(function(err){
            setCreateErroMessage("Error Updating Your Vault"+err.message);
            
            setCreateError(true);
        });

      }

      const handleConfirmDialogClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        console.log(event.target);
        setConfirmMessageDialogOpen(false);

        if(event.target.innerHTML =="Yes")
        {
          if(action.current == "Upload") 
             encryptFiles();

          if(action.current== "Send")
            sendVault();
        }
        
    };
   
    const handleDialogClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setMessageDialogOpen(false);
    };  

      const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
      const files = (acceptedFiles) => {
          
        const _files = acceptedFiles.map(file => (
            <span  className={classes.listText}> <li key={file.path}>
            {file.path} - {file.size} bytes - {file.type}  - Type
            </li>
            </span>
          ));
      
          console.log(acceptedFiles);
          setFileInfo(_files);
          setSelectedFiles(acceptedFiles);
      } 

     
    return (
        <div className={classes.root}>

        <Grid item xs={12} sm={12}>
             <Paper className={classes.paper}><div className={classes.addressHeader}>
             <span className={classes.headerText}>View Vault</span> <LockIcon className={classes.largeIcon}/></div>
             <div className={classes.formCreate}  >
        <form className={classes.form} noValidate onSubmit={handleSubmit(_handleSubmit)} >
          <Grid container spacing={3}>
            
          <Grid item xs={12} sm={12}>
          <InputLabel id="demo-simple-select-label">Name</InputLabel>
  
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<TextField disabled={filesUploaded || isGettingVault} onChange={onChange} value={value} label="Alias"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            />)} name="alias"  control={control}  rules={{required: 'Alias is required'}}  />
               

            </Grid>

            <Grid item xs={12} sm={12}>
           
            <InputLabel id="demo-simple-select-label">Trustees</InputLabel>
          
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<Select  
            options={trustees}
            isMulti
            isDisabled={filesUploaded || isGettingVault}
            onChange={onChange} value={value}
           label="Trustees"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            >
        
            </Select>)} name="trustees"  control={control}  rules={{required: 'Trustee(s) is required'}}  />
            <span className={classes.error}><ErrorMessage errors={errors} name="trustees"  /></span>
   

            </Grid>

            <Grid item xs={12} sm={6}>
            <Controller render={({field: {onChange,value},fieldState:{error}}) => (
                <TextField disabled={filesUploaded || isGettingVault} type ="number" onChange={onChange} value={value} label="Check In (Days)"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null} 
                />)} 
                name="checkInInterval"  control={control}  
                rules={{required: 'Check in interval is required',min:{value:1,message:'Minimum is 1 Day'}}}

                />
            </Grid>

      
            <Grid item xs={12} sm={12}>
            
           
            <Dropzone onDrop={acceptedFiles => files(acceptedFiles)} disabled={filesUploaded || isGettingVault}>
            {({getRootProps, getInputProps}) => (       
         <section className={classes.filesDiv}>    
               <div {...getRootProps()}>
       
        <input {...getInputProps()} />

        <p className={classes.fileText}>Drag 'n' drop some files here, or click to select files</p>
        </div>
        </section>
            )}
</Dropzone> 
     <aside>
        <h4 className={classes.listText}>Selected Files</h4>
        <ul className={classes.listText}>{fileInfo}</ul>
      </aside>
</Grid>            
            <Grid item xs={6}>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled = {isGettingVault || filesUploaded}
          >
           {submitLabel}
          </Button>
         </Grid>
         <Grid item xs={6}>
          <Button
            type="reset"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            disabled = {isGettingVault || !filesUploaded || sentToTrustees}
            onClick={() => handleSendToTrustees()}
          >
           Send To Trustees
          </Button>
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

               <Snackbar open={messageDialogOpen} autoHideDuration={80000} onClose={handleDialogClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleDialogClose} severity={dialogSeverity} elevation={6} variant="filled"> 
                {dialogMessage}
                </MuiAlert>
               </Snackbar>
   
            </Grid>
          </Grid>
          
        </form>
         </div>   

      </Paper>
      </Grid>
      <Dialog
        open={confirmMessageDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           {confirmDialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary" autoFocus  variant="contained">
            No
          </Button>
          <Button onClick={handleConfirmDialogClose} color="secondary"  variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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

export default ViewVault
