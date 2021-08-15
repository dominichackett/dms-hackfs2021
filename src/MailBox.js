import React,{useState,useEffect,useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {   makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { UserContext } from './UserContext';
import EmailIcon from '@material-ui/icons/Email';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useHistory } from "react-router-dom";
import { format} from 'date-fns';

const useStyles = makeStyles((theme) => ({
   
    largeIcon: {
      width: 50,
      height: 50,
      "color":"rgba(255, 201, 5, 1)"

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
      "color":"rgba(255, 201, 5, 1)"

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

function MailBox() {
    const classes = useStyles();
    const [inbox,setInbox] = useState([]);
    const [addressBook,setAddressBook] = useState(new Map());
    const  uContext = useContext(UserContext);
    const  [gotAddressBook,setGotAddressBook]  = useState();
    const history = useHistory();
    //Get Inbox for current user
    useEffect(()=>{

        async function getInbox()
        {
            
            // Grab all existing inbox messages and decrypt them locally
            const messages = await uContext.user.listInboxMessages();
            const _inbox = [];
            for (const message of messages) {
              //inbox.push(await this.messageDecoder(message))
              const bytes = await uContext.privateKey.decrypt(message.body);
              const body = new TextDecoder().decode(bytes);
              const {from} = message
              const {readAt} = message
              const {createdAt} = message
              const {id} = message
              console.log(body);
              console.log(from);
              console.log(createdAt);
              console.log(addressBook[from])
              console.log((addressBook[from] ? addressBook[from].alias : "Anonymous"));
              const obj = {id:id,from:(addressBook[from] ? addressBook[from].alias : "Anonymous")
                          ,vault:JSON.parse(body),createdAt:createdAt};

             console.log(obj);    
             _inbox.push(obj);         
            // await uContext.user.deleteInboxMessage(id);
            }
            setInbox(_inbox);
        }

       
        if(gotAddressBook)
        {
            getInbox();
        }

    },[gotAddressBook]);
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
   
    return (
        <div className={classes.root}>

        <Grid item xs={12} sm={12}>
             <Paper className={classes.paper}><div className={classes.addressHeader}>
             <span className={classes.headerText}>Inbox</span> <EmailIcon className={classes.largeIcon}/></div>
             <div className={classes.formCreate}  >
             <TableContainer className={classes.container}>
    
    <Table stickyHeader  aria-label="customized table">
      <TableHead style={{ backgroundColor: 'blue' }}>
        <TableRow>
        <TableCell><span className={classes.tableHeader}>From</span></TableCell>
          <TableCell  align="left"><span className={classes.tableHeader}>Subject</span></TableCell>
          <TableCell  align="left"><span className={classes.tableHeader}>Date</span></TableCell>
          <TableCell  align="center"><span className={classes.tableHeader}>View Vault</span></TableCell>
      
        </TableRow>
      </TableHead>
      <TableBody>
      {inbox.map((row) => (
            <TableRow key={row.id} className={classes.tableRow}>
            <TableCell  >
             <span  className={classes.tableCellSecondary}> 
            <span className={classes.tableText}>{row.from}</span> 

             </span>
            </TableCell>
            <TableCell >
             <span  className={classes.tableCellSecondary}> 
            <span className={classes.tableText}>Entrusted Encrypted Vault Data</span> 

             </span>
            </TableCell>
            <TableCell  >
             
            <span className={classes.tableText}>{format(new Date(parseInt(row.createdAt)/1000000),"iii do MMMM yyyy p")}</span>
             </TableCell>
            <TableCell align="center">
             <Button
            
            onClick={() => history.push(`/trusteevault/${row.id}`)} 
            variant="contained"
            color="secondary"
            
          >
View          </Button>
            
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

export default MailBox
