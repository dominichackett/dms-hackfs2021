import React,{useState,useEffect,useContext,useRef} from 'react';
import ContactsIcon from '@material-ui/icons/Contacts';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {   makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CreateIcon from '@material-ui/icons/Create';

import {useForm ,Controller, set } from "react-hook-form";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from './UserContext';
import PanToolIcon from '@material-ui/icons/PanTool';
import Avatar from '@material-ui/core/Avatar';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
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
    paperAddress:
    {
        padding: "15px",
        textAlign: 'left',
        backgroundColor: "#D9D9D9",
        "border-radius": "10px",
       border: "1px solid rgb(0, 0, 0)",
       
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

    addressBookButtons:
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
        
    }


    
}));

function AddressBook() {
    const classes = useStyles();
    const [createSuccessMessage,setCreateSuccessMessage] = useState("");
    const [createError, setCreateError] = useState(false);
    const [createErrorMessage,setCreateErroMessage] = useState("");
    const [confirmDialogSeverity,setConfirmDialogSeverity] = useState("info");
    const [confirmDialogMessage,setConfirmDialogMessage] = useState("");
    const [confirmMessageDialogOpen,setConfirmMessageDialogOpen] = useState(false);
    const [createSuccess, setCreateSuccess] = useState(false);
    const [dialogMessage,setDialogMessage] = useState("");
    const [dialogSeverity,setDialogSeverity] = useState("success");
    const [messageDialogOpen,setMessageDialogOpen] = useState(false);
    const [submitLabel,setSubmitLabel] = useState("Add");
    const  uContext = useContext(UserContext);
    const [addressBook,setAddressBook]  = useState([]);
    const [refreshAddressBook,setRefreshAddressBook]  = useState(new Date());
    const action = useRef("Add");
    const idToDelete = useRef(null);
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState("");
  
    const handleData = (event) => {
      setCopied(false)
      setData(event.target.value);
    };
    //Get Address Book Data
    useEffect(()=>{
        async function getAddressBookData()
        {
           console.log(uContext.db)
           if(uContext.db && uContext.threadid)
           { 
              const found = await uContext.db.find(uContext.threadid, "AddressBook", {});
              console.log(found);
              setAddressBook(found);
           }
        }
        getAddressBookData();
    },[uContext.db,refreshAddressBook]);

    function deleteAddressBook()
    {

        uContext.db.delete(uContext.threadid,'AddressBook',[idToDelete.current])
        .then(function(record){
           
            setCreateSuccessMessage("Address Book Entry Deleted");
            setCreateSuccess(true);
            setRefreshAddressBook(new Date());
            setSubmitLabel("Add");
            action.current = "Add";
            idToDelete.current = null;
            reset();
        })
        .catch(function(err){
            setCreateErroMessage("Error Deleting Address Book Entry");
            
            setCreateError(true);
        });


    }

     async function saveAddressBook()
    {
        console.log(uContext.db);
        console.log(uContext.threadid)
       
        //alert(`${getValues('alias')  }`)
         uContext.db.create(uContext.threadid,'AddressBook',[{_id:getValues('_id'),alias:getValues('alias')}])
        .then(function(record){
           
            setCreateSuccessMessage("Address Book Entry Saved");
            setCreateSuccess(true);
            setRefreshAddressBook(new Date());
            action.current = "Add";
            reset();
        })
        .catch(function(err){
            setCreateErroMessage("Error Saving Address Book Entry");
            setCreateError(true);
        });
    }

    function updateAddressBook()
    {

        uContext.db.save(uContext.threadid,'AddressBook',[{_id:getValues('_id'),alias:getValues('alias')}])
        .then(function(record){
           
            setCreateSuccessMessage("Address Book Entry Saved");
            setCreateSuccess(true);
            setRefreshAddressBook(new Date());
            setSubmitLabel("Add");
            action.current = "Add";
            reset();
        })
        .catch(function(err){
            setCreateErroMessage("Error Saving Address Book Entry");
            
            setCreateError(true);
        });

    }
    const addressBookEntry = () => {
       if(submitLabel == "Add")
         saveAddressBook();
       else
         updateAddressBook();  
    }



    const _handleSubmit = (data,e) => {

        if(submitLabel == "Add")
        setConfirmDialogMessage(`Create Address Book Entry? `);
        else
        setConfirmDialogMessage('Update Address Book Entry');

        setConfirmDialogSeverity("info");
        setConfirmMessageDialogOpen(true);  
      
       
      };

      const handleResetForm = (event) => {

        setSubmitLabel("Add"); 
        reset();

      
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

      const {reset,getValues,setValue,control,handleSubmit,formState: { errors }} = useForm({defaultValues:{
        _id: "",
        alias:""
      }});

      const handleConfirmDialogClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        console.log(event.target);
        setConfirmMessageDialogOpen(false);

        if(event.target.innerHTML =="Yes")
        {
            if(action.current == "Add")
              addressBookEntry();
            
              if(action.current == "Delete")
                deleteAddressBook();
        }
        else
        {
            setDialogMessage("Address Book Entry Not Saved");
            setDialogSeverity("error");
            setMessageDialogOpen(true);
            action.current = "Add";
        }
    };
 
    const handleDelete = (data) => {
        setConfirmDialogMessage(`Delete Address Book Entry? `);
        action.current = "Delete";
        idToDelete.current = data._id;
        setConfirmDialogSeverity("info");
        setConfirmMessageDialogOpen(true);

      
    }


    const handleModify =  (data) => {
        console.log(data);
        setValue("_id",data._id);
        setValue("alias",data.alias);
        setSubmitLabel("Update");
    }



            function AddressBookEntry(props) {
        const classes = useStyles();
      return(<React.Fragment>
                <Grid item xs={12} sm={4}>
                <Paper className={classes.paperAddress}>
      
                   <Avatar className={classes.avatar} ></Avatar>
                  
                   <div className={classes.aliasDiv}><span className={classes.alias}> {props.row.alias}</span></div>
                   <div className={classes.addressBookButtons}><Button  
            variant="contained"
            color="primary"
            onClick={() => handleModify(props.row)}>Modify</Button>
                   <Button  
            variant="contained"
            color="secondary" onClick={() => handleDelete(props.row)}>Delete</Button></div>
                 </Paper>   
               </Grid>
      </React.Fragment>);
      }
       
    return (
        <div className={classes.root}>

 <Grid item xs={12} sm={12}>
      <Paper className={classes.paper}><div className={classes.addressHeader}>
      <span className={classes.headerText}>Add / Edit Address</span> <CreateIcon className={classes.largeIcon}/></div>
      
        <div className={classes.formCreate}  >
        <form className={classes.form} noValidate onSubmit={handleSubmit(_handleSubmit)} >
          <Grid container spacing={3}>
            
          <Grid item xs={12} sm={12}>
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<TextField onChange={onChange} value={value} label="Alias"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            />)} name="alias"  control={control}  rules={{required: 'Alias is required'}}  />
               

            </Grid>
            
            <Grid item xs={12} sm={12}>
            <Controller render={({field: {onChange,onBlur, value, name, ref },fieldState:{error}}) => (<TextField onChange={onChange} value={value} label="Public Key"  fullWidth variant="outlined"  error={!!error}    helperText={error ? error.message : null}  
            />)} name="_id"  control={control}  rules={{required: 'Public Key is required'}}  />
               

            </Grid>
            
            
            <Grid item xs={6}>
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            
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
            onClick={handleResetForm}
            
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


   <Grid item xs={12} sm={12}>
      <Paper className={classes.paper}><div className={classes.addressHeader}>
      <span className={classes.headerText}>My Public Key</span> <VpnKeyIcon className={classes.largeIcon}/></div>
   
      <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>

      <div className={classes.formCreate}>
          <span className={classes.alias}>{uContext.privateKey?.public?.toString()}</span>
      </div>
     </Grid>
      </Grid>
     
     </Paper>
    
    </Grid>


   <Grid item xs={12} sm={12}>
      <Paper className={classes.paper}><div className={classes.addressHeader}>
      <span className={classes.headerText}>Address Book</span> <ContactsIcon className={classes.largeIcon}/></div>
      <Grid container spacing={2}>

      {addressBook.map((row) => (
        <AddressBookEntry row={row}></AddressBookEntry>
      ))}
      </Grid>
     
     </Paper>
    
    </Grid>

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
   
        </div>
    )
}

export default AddressBook
