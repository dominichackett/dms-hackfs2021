import {  createTheme, makeStyles, ThemeProvider  ,withStyles} from '@material-ui/core/styles';
import './App.css';
import{BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import  React, {useState}  from 'react';
import CreateVault from './CreateVault';
import EditAddress from './EditAddress';
import LandingPage from './LandingPage';
import ViewVault from './ViewVault';
import AddressBook from './AddressBook';
import Vaults from './Vaults';
import MailBox from './MailBox';
import AppNav from './appnav';
import CeramicClient from '@ceramicnetwork/http-client'
import { UserContext } from './UserContext';
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { DID } from 'dids'
import { green } from '@material-ui/core/colors';
const { IDX } = require('@ceramicstudio/idx')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  largeIcon: {
    width: 160,
    height: 160,
  },

  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor:"#3b3b3b"

  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
   container: {
    flex:1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: 0,
    paddingRight:0  ,
    backgroundColor:"#3b3b3b"
  },
}));

const Theme = {
  palette: {
    primary: {  // primary color
    contrastText: "#FFFFFF",
    main:"#080808",  // Green
    
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    

  },
  text: {
      primary:"rgba(255, 201, 5, 1)",
     /* secondary: styles.tt,
      disabled: styles.ttt,
      hint: styles.tttt,*/
      
    },
    action: {
     hover :"rgba(255, 201, 5, .5)"
    }

   
  },
  overrides:{
  MuiSelect: {
    root: {
      
        background: 'green',
        color:"black",
        
      }
  },

  MuiMenuItem:
  {
     root:{
        backgroundColor:"red"
     }
  }
}
};
function App() {
  const classes = useStyles();
  const theme = createTheme(Theme);
  const API_URL = "https://ceramic-clay.3boxlabs.com"
  const ceramic = new CeramicClient(API_URL)
  const resolver = { ...KeyDidResolver.getResolver(),
    ...ThreeIdResolver.getResolver(ceramic) }
const did = new DID({ resolver })
ceramic.did = did;
const [providerValue,setProviderValue] = useState(() => (ceramic));
const [db,setDb]  =useState();
const [idx,setIdx] = useState(new IDX({ ceramic }));
const [privateKey,setPrivateKey] = useState(null);
const [threadid,setThreadid] = useState();

  return (
    <div >

    <ThemeProvider theme={theme}>
    <UserContext.Provider  value={{value:providerValue,setValue:setProviderValue,db:db,setDb:setDb,idx:idx,setIdx:setIdx,privateKey:privateKey,setPrivateKey:setPrivateKey,threadid:threadid,setThreadid:setThreadid}}>

    <Router>
     <Switch>
 <div className={classes.content}>
 <AppNav />

 <div  />
 <Container maxWidth="md" className={classes.container}>

  <Route exact path="/" component={LandingPage} />
  <Route exact path="/vaults" component={Vaults} />
  <Route exact path="/createvault" component={CreateVault} />
  <Route exact path="/mailbox" component={MailBox} />
  <Route exact path="/addressbook" component={AddressBook} />

  <Route  path="/viewvault/:id" component={ViewVault} />
  <Route  path="/editaddress/:id" component={EditAddress} />

  </Container>
 </div>

 

   </Switch>
     </Router>
     </UserContext.Provider>
     </ThemeProvider>
  
 </div>
  );
}

export default App;
