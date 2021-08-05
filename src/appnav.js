import React, {useState,useContext}  from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {  makeStyles} from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { UserContext } from './UserContext';
const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolbar:{
    backgroundColor:"rgb(255,147,50)",
    backgroundColor:"#3C6E71",
    backgroundColor:"#2D82B7",
    backgroundColor:"#F18805",
    backgroundColor:"#0A0F0D"
  }
}));

export default function AppNav() {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const [profilePicUrl,setProfilePicUrl] = useState("");
    const [userInititals,setUserInitials] =  useState();
    const classes = useStyles();
    const history = useHistory();
    const uContext = useContext(UserContext);
    const _handleDisconnect = (event) => {
      setAnchorEl(event.currentTarget);
  
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const logoutMenu = () => {
        setAnchorEl(null);
        uContext.value.close();
       history.push("/");
  
      };
  const profileMenu = () => {
    setAnchorEl(null);
    history.push("/profile");
  }


  const vaultMenu = () => {
    history.push("/vaults");
  }

    const inboxMenu = () => {
    history.push("/inbox");
  }
          
  
  const addressBookMenu = () => {
    history.push("/addressbook");
  }
    return (
        <React.Fragment>
             <AppBar position="static" color="secondary">
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Dead Man's Switch 
          </Typography>
         
         

          { (uContext.idx.ceramic.did.authenticated == true && <Button color="inherit" onClick={vaultMenu}>Vaults</Button> ) }
          { (uContext.idx.ceramic.did.authenticated == true &&   <Button color="inherit" onClick={inboxMenu}>Inbox</Button> )}
          { (uContext.idx.ceramic.did.authenticated == true &&   <Button color="inherit" onClick={addressBookMenu}>Address Book</Button> )}
          { (uContext.idx.ceramic.did.authenticated == true && <Button onClick={_handleDisconnect} aria-haspopup="true"><Avatar src={profilePicUrl}>{userInititals}</Avatar></Button>)}

          <Menu
    id="simple-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
  >
    <MenuItem onClick={profileMenu }>My Profile</MenuItem>
    <MenuItem onClick={logoutMenu}>Logout</MenuItem>
  </Menu>

        </Toolbar>
      </AppBar> 
     
        </React.Fragment>
    )
}
