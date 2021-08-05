import React,{useState,useEffect,useContext,useRef} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {   makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';
import { useHistory,useParams } from "react-router-dom";

import {useForm ,Controller, set } from "react-hook-form";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from './UserContext';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/Lock';
import VaultImage from "./images/vault.png";
import { PrivateKey} from '@textile/hub'
import Dropzone from 'react-dropzone';
import {useDropzone} from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select'
import AddressBook from './AddressBook';
import { ErrorMessage } from '@hookform/error-message';

const useStyles = makeStyles((theme) => ({
   
    largeIcon: {
      width: 50,
      height: 50,
    },
    sousouIcon:{
    width: 50,
    height: 50,
    color : "rgb(0, 0, 0)"
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
    const [trustees,setTrustees] = useState([]);
    const  uContext = useContext(UserContext);
    const {id} = useParams();
    const [isGettingVault,setIsGettingVault]  = useState(true);
    const [myVault,setMyVault] = useState(null);
    
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
                      setValue("trustees",vault.trustee);
                      setMyVault(vault);
                  }
              } 
           }
       
        getVault();
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
        setCreateError(true); 
        alert(JSON.stringify(data)); 
        if(submitLabel == "Add")
        setConfirmDialogMessage(`Create New Vault? `);
        else
        setConfirmDialogMessage('Update Vault Details?');

        setConfirmDialogSeverity("info");
        setConfirmMessageDialogOpen(true);  
      
       
      };
      const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
      const files = (acceptedFiles) => {
        const files = acceptedFiles.map(file => (
            <span  className={classes.listText}> <li key={file.path}>
            {file.path} - {file.size} bytes
            </li>
            </span>
          ));

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
  
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<TextField onChange={onChange} value={value} label="Alias"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            />)} name="alias"  control={control}  rules={{required: 'Alias is required'}}  />
               

            </Grid>

            <Grid item xs={12} sm={12}>
           
            <InputLabel id="demo-simple-select-label">Trustees</InputLabel>
          
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<Select  
            options={trustees}
            isMulti
            onChange={onChange} value={value}
           label="Trustees"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            >
        
            </Select>)} name="trustees"  control={control}  rules={{required: 'Trustee(s) is required'}}  />
            <span className={classes.error}><ErrorMessage errors={errors} name="trustees"  /></span>
   

            </Grid>

            
      
            <Grid item xs={12} sm={12}>
            
           
            <Dropzone onDrop={acceptedFiles => files(acceptedFiles)}>
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
        <ul className={classes.listText}>{selectedFiles}</ul>
      </aside>
</Grid>            
            <Grid item xs={6}>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled = {isGettingVault}
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
            
          >
           Reset
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
            </Grid>
          </Grid>
          
        </form>
         </div>   

      </Paper>
      </Grid>
     </div>        
    )
}

export default ViewVault
