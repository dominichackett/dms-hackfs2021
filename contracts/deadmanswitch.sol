pragma solidity ^0.6.0;
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
pragma experimental ABIEncoderV2;

/**
 * @title Dead Man's Switch 
 * @dev Main contract for Dead Man's Switch HackFS 2021
 * - Users can:
 *   # Store encrypted keys in a vault. 
 *   # Check in to show proof of life.  If the checkin interval has passed for a vault it is automatically unlocked
 *   # Get the encrypted key for a vault if it is unlocked
 * @author Dominic Leon Hackett
 */
 
 contract DeadManSwitch is ChainlinkClient
 {
     
	 struct Trustee
	 {
	    bool isValue;
		string key;
	 }
	 
	 struct Vault
	 {
	    string id; 
		address owner;
		bool  locked;
		bool isValue;
		uint256 checkInInterval;
		mapping (string => Trustee) trustees;
	 }
	 
     struct User
     {
        address userAddress;
		uint256 lastSeen;
        bool isValue;		
     }
	 
	  mapping (string => Vault) vaults;
	  mapping (address => User) users; 
	  mapping (bytes32 => string) vaultAlarm;
      address _oracle;
	  address owner;
	  bytes32 _jobId;
	  uint256 fee;
	  event CheckVaultAtInterval(string indexed vault,uint256 checkInInterval,uint256 dateEmitted);
	 // event  NewTrustee(string indexed vault,string trustee);
	 // event ArrayLength(uint256 l);
	  
 /**
   * @dev Modifier isValidUser. Make sure user exist
   *
   **/	  
	  
    modifier isValidUser (){
	  require(users[msg.sender].isValue == true, "User not found");
   _; 
 }	  
 
 /**
   * @dev Modifier isValidVault. Make sure vault exist
   * @param   id  Vault id
   **/	  
	  
    modifier isValidVault (string memory  id){
	  require(vaults[id].isValue == true, "Invalid vault");
   _; 
 }	  
 
 
 /**
   * @dev Modifier vaultDoesntExist. Make sure vault exist
   * @param   id  Vault id
   **/	  
	  
    modifier vaultDoesntExist (string memory  id){
	  require(vaults[id].isValue == false, "Vault Already Exist");
   _; 
 }	  


/**
   * @dev Modifier isValidTrustee. Make sure vault trustee exist
   * @param   vault  Vault id
   * @param   trustee 
   **/	  
	  
    modifier isValidTrustee (string memory  vault,string memory trustee){
	  require(vaults[vault].trustees[trustee].isValue == true, "Invalid vault or trustee");
   _; 
 }	  
 	 
  /**
   * @dev Function allows members to take a loan based on their share holding
   * @param trustees Individuals entrusted with the vault.
   * @param vault  vault id.
   * @param keys encrypted keys.
   * @param checkInInterval The number of days that must elaspe before vault is automatically unlocked and made accessible to trustee
   **/
    
    function createVault(string[] calldata trustees,string calldata vault,string[] calldata keys,uint256 checkInInterval) external  vaultDoesntExist(vault)
    {
	   	 require(trustees.length > 0 , "Trustees not specified");
		 require(keys.length > 0,"Decryption keys not specified");
		 require(keys.length == trustees.length, "Missing trustee or  private key information");
		    
		 if(users[msg.sender].isValue == false)
		    users[msg.sender] =   User(msg.sender,block.timestamp,true);

         vaults[vault].id = vault;
         vaults[vault].owner = msg.sender;
         vaults[vault].locked = true;
         vaults[vault].isValue = true;
         vaults[vault].checkInInterval = checkInInterval;
		 
		// emit ArrayLength(trustees.length);
		// emit ArrayLength(keys.length);
		 for(uint i =0 ;i < trustees.length;i++)
         {
		 
		    // vaults[vault].trustees[trustees[i]].isValue = true;
		     //vaults[vault].trustees[trustees[i]].key = keys[i];
            vaults[vault].trustees[trustees[i]] = Trustee(true,keys[i]);
			//emit NewTrustee(vault,vaults[vault].trustees[trustees[i]].key);
		 }
		 
		setVaultChecker(vault,checkInInterval);
	
	}
	
	 constructor() public {
	   setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); //Mumbai Matic Address

	    owner = msg.sender;
		_oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C;  //LiveRiver Oracle
		_jobId = "6c7a0cf966184f6b935e6dc1c8d26d3e";  //Sleep Job
	    fee = 0.01 * 10 ** 18; // 0.01 LINK

	 }
	 
	 
	 
 /**
   * @dev Function allows user to checkIn
   * 
   **/
    
    function checkIn() external isValidUser  
    {
	   users[msg.sender].lastSeen = block.timestamp;
	}
	
 /**
   * @dev Function allows user to get vault key
   * @param vault  vault id.
   * @param trustee id of the trustee entrusted with the vault.  
   * 
   **/
    
    function getVaultKey(string calldata vault,string calldata trustee) view external  returns(string memory)
    {
	   require(vaults[vault].locked == false, "Vault is locked");
	   
	   return(vaults[vault].trustees[trustee].key);
	}
	
	/**
   * @dev Function calls Chainlink Alarm to check vault at future date
   * @param vault  vault id.
   * @param interval The duration in secods to wait before calling alarm.  
   * 
   **/
	
	function setVaultChecker(string memory vault,uint256 interval) internal
	{
	   Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
       req.addUint("until", block.timestamp+ (interval * 1 seconds));

	   bytes32  reqestID = sendChainlinkRequestTo(_oracle, req, fee);
	   vaultAlarm[reqestID]  = vault;
	
	}
	
	
	
	/**
   * @dev Function handles fulfillment of chainlink alarm. Then emits event to tell moralis.io to check the vault to see if it should be *      unlocked.
   * @param _requestId  Request that is being fulfilled
   *  
   * 
   **/
	
	function fulfill(bytes32 _requestId)  public  recordChainlinkFulfillment(_requestId)
    {
        
		string memory vault = vaultAlarm[_requestId];
		uint256 vaultOwnerLastSeen = users[vaults[vault].owner].lastSeen;
        uint256 vaultCheckInInterval = vaults[vault].checkInInterval;	
	
        if(block.timestamp - vaultOwnerLastSeen > vaultCheckInInterval)
  	       vaults[vault].locked = false;  //trustees can now retrieve the encrypted key to decrypt files  
        else
           setVaultChecker(vault,vaultCheckInInterval);		
	}

	
	
	/**
     * Withdraw LINK from this contract
     * 
     * 
     * 
     */
    function withdrawLink() external 
	{
       require(msg.sender == owner,"Owner required to execute this function");
	   LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
       require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
	

      }

}