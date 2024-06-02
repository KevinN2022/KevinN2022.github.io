function User(config)
{
  this.config = config;
  
  this.userID = -1;
  this.userGuid = -1;
  this.userName = "Guest";
  this.authToken = "";
  this.connectToServer = false;
  this.lastActionTime = new Date();
  this.stats = {};
  this.debug = true;
  this.appStarted = false;
  this.autoStart = true;
  this.secsToInactivity = 120;
  
  this.init = function()
  {
    this.userGuid = this.isNull(data.getData("userGuid"),-1);
    
    if(this.debug) 
    {
      console.log("user.init()");   

      console.log("...user.init(): guid on file: " + this.userGuid);
    }

    if(this.userGuid == -1)
    {
      
      if(this.debug) console.log("...user.init(): no userGuid found");
        
      if(this.debug) console.log("...user.init(): generating guid");

      if(this.config.autoLogin) 
      {
        this.createGuestAccount();
      }
      else
      {
        this.checkAndStartApp();
      }
      
    }
    else
    {
      console.log("...user.init(): attempting to get userID for guid");

      data.sendDataAndCallBack(this.config.authUrl + "user-get-id.php?autoJoin=true", {}, this.authUser);
    }
    
    this.lastActionTime = new Date();
  }

  this.getData = function() { return this.config;}
  
  this.loginCheck = function()
  {
    return this.userID > 0;
  }

  this.syncUser = function(data)
  {
    if(data.user != undefined)
    {
      user.stats = data.user;
    }
    else
    {
      user.stats = data;
    }

    user.setUserName(user.stats.userName);

  }





  this.authUser = function(data)
  {
    if(data.userGuid == user.userGuid)
    {
      user.userID = data.userID;
    }

    user.syncUser(data);

    user.checkAndStartApp();
    
  }

  this.checkAndStartApp = function()
  {

    if(!user.appStarted)
    {
        console.log("User.sync(): starting app");
        
        if(user.config.startAppAfterAuth)
        {
          user.appStarted = true;
          
          app.loadAfterLogin();
        }

        //startApp();
    }
  }
  
  this.createGuestAccount = function()
  {
        this.userGuid = data.generateGuid();

        if(this.debug) console.log("...user.createGuestAccount(): new guid gen:" + this.userGuid);

        data.save("userGuid", this.userGuid);

        if(this.connectToServer)
        {
            data.sendDataAndCallBack("api/user-create-guest-account.php", {}, user.sync);
        }
  }


  this.login = function()
  {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;

    data.sendDataAndCallBack("server/api/auth/login.php?username=" + username + "&password=" + password, {}, user.login_complete);
  }

  this.login_complete = function(data)
  {
    //console.log(data);
    if(data.hadError)
    {
      playGui.setLoginError(data.errorMsg);
    }
    else
    {
      playGui.setLoginError("You are logged in, loading game now");

      playGui.stopRendering();

      user.userID = data.userID;

      user.userGuid = data.userGuid;

      user.setUserName(data.userName);

      //gui.fillUserHud(dataPacket.data.user);

      console.log("userID Set:" + user.userID);

      console.log("userGuid Set:" + user.userGuid);

      
      
      data.saveData("userGuid", user.userGuid);

      data.saveData("userID", user.userID);
      
      data.saveData("last-user-guid", user.userGuid);

      data.saveData("last-user-id", user.userID);
      
      startApp();

    }
  }


  
  this.register = function(config, data)
  {
    
    if(data.username == "")
    {
      utils.growl("Username is required", 5);
      return;
    }
    
    if(data.password != data.confirmPassword)
    {
      utils.growl("Passwords do not match", 5);
      return;
    }    

    if(data.password == "")
    {
      utils.growl("Passwords is required", 5);
      return;
    }    

    
    if(data.email == "")
    {
      utils.growl("Email is required", 5);
      return;
    }    

    if(data.terms != true)
    {
      utils.growl("You must agree to the terms", 5);
      return;
    }    

    var url = config.authUrl + "register.php?username=" + data.username;
    url+="&password=" + data.password;
    url+="&confirmPassword=" + data.confirmPassword;
    url+="&email=" + data.email;

    //TODO: Change to post: sendPostData
    dataHandler.sendDataAndCallBack(url, {}, function(data)
                  {
                    //console.log(data);
                    if(data.hadError)
                    {
                      utils.growl(data.errorMsg, 5);
                    }
                    else
                    {
                      user.userID = data.userID;
                
                      user.userGuid = data.userGuid;
                
                      user.setUserName(data.userName);
                
                      console.log("userID Set:" + user.userID);
                      console.log("userGuid Set:" + user.userGuid);
                
                      data.saveData("userGuid", user.userGuid);
                
                      data.saveData("userID", user.userID);
                
                      data.saveData("last-user-guid", user.userGuid);
                    
                      data.saveData("last-user-id", user.userID);
                      
                      startApp();                
                
                    }
                  }
      
      );
  }



  this.isInactive = function()
  {
    var secsPast = this.secsSinceLastActivity();
    
    return secsPast > this.secsToInactivity;

  }

  this.secsSinceLastActivity = function()
  {
    var currDate = new Date();

    var secsPast = (currDate.getTime() - this.lastActionTime.getTime()) / 1000;
    
    return secsPast;
  }

  this.tookAction = function()
  {
    this.lastActionTime = new Date();
  }

  this.logout = function()
  {
    this.userID = -1;
    this.userGuid = "";

    data.saveData("userGuid", "");

    data.saveData("userID", -1);
    
    data.saveData("last-user-guid", this.userGuid);
    
    data.saveData("last-user-id", this.userID);

    //gui.showView("view-new-user");
  }

  this.isNull = function(val, defaultVal){  if( val ) { return val;} return defaultVal;}
  this.setUserName = function(u){ this.userName = u;this.stats.userName = u; this.stats.username = u;}
  this.getUserName = function(){ return this.userName;}
  this.getUserID = function() {return this.userID;}
  this.setUserID = function(id){this.userID = id;this.stats.userID;}  
  this.getStats = function(){ return this.stats;}

}
