function Data()
{
    this.config = {rootUrl:config.rootUrl};

    this.debugAjax = false;

    this.loadingDivID = "";
    
    this.save = function(key,value){this.saveData(key,value);}

    this.saveData = function(key, value)
    {
        localStorage.setItem(key, JSON.stringify(value));
    }

    this.get = function(key) {return this.getData(key);}
    this.getData = function(key)
    {
        var val = localStorage.getItem(key);

        if(this.isJsonString(val))
        {      
          return JSON.parse(val)
        }
        else
        {
          return val;
        }
    }

    this.clearAllData = function()
    {
        localStorage.clear();
    }

    this.generateGuid = function() 
    {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  
    this.ajaxOff = function()
    {
        //place holder
    }
  
    this.addUserAuth = function(data)
    {
      dataHandler.userGuid = user.userGuid;
      dataHandler.authToken = user.authToken;

      return data;
    }

    this.startAjax = function()
    {
      this.numRunningAjax++;

      var d = document.getElementById("ajax-ind-img");
      
      if(d != undefined) 
      {
        d.style.visibility = "visible";
      }
    }


    this.endAjax = function()
    {
      this.numRunningAjax--;
      
      if(this.numRunningAjax <= 0) this.numRunningAjax = 0;

      
      var d = document.getElementById("ajax-ind-img");
      
      if(d != undefined) 
      {
        d.style.visibility = "hidden";
      }


      //document.getElementById("div-ajax-indicator").innerHTML = "Request: " + dataHandler.numRunningAjax;
    }


    this.loadDiv = function(url, urlData, divID)
    {
      if(dataHandler.loadingDivID != "")
      {
        console.error(dataHandler.loadingDivID + " is waiting to be loaded");
        return;
      }
      else
      {
        dataHandler.loadingDivID = divID;
      }


      var requestUrl = this.config.rootUrl + url;

      urlData = this.addUserAuth(urlData);

      if(dataHandler.debugAjax) console.log("dataHandler.loadDiv(): sending", data, url);

      dataHandler.startAjax();

      $.ajax({
        type: "GET",
        url: requestUrl,
        data:urlData,
        complete: function () {
            dataHandler.ajaxOff();
        },
        success: function(dataPacket) {
              

              document.getElementById(dataHandler.loadingDivID).innerHTML = dataPacket;

              dataHandler.loadingDivID = "";
              
              dataHandler.endAjax();
        
            }
        ,error: function(jqXHR, exception) {
            console.error("AJAX Issue:" + jqXHR.responseText);
            }
      });

    }


    
    this.sendPostData = function(url, urlData, callBack)
    {
      var requestUrl = url;
        
      if(!requestUrl.includes("http"))
      {
        requestUrl = this.config.rootUrl + url;
      }
      

      urlData = this.addUserAuth(urlData);

      if(dataHandler.debugAjax) console.log("dataHandler.sendDataAndCallBack(): sending", urlData, url);

      dataHandler.startAjax();

      $.ajax({
        type: "POST",
        url: requestUrl,
        data:urlData,
        complete: function () {
            dataHandler.ajaxOff();
        },
        success: function(dataPacket) {
        
              if(dataHandler.debugAjax) console.log("dataHandler.sendDataAndCallBack(): returned", dataPacket);

              if(dataPacket.hadError)
              {
                console.warn("WARNING: " + dataPacket.error.errorMsg);
                utils.growl(dataPacket.error.errorMsg, 3);
                return;
              }

              if(dataPacket.userAlerts.length > 0)
              {
                utils.growl(dataPacket.userAlerts[0], 3);
              }


              callBack(dataPacket.data);


              dataHandler.endAjax();
        
            }
        ,error: function(jqXHR, exception) {
            console.error("AJAX Issue:" + jqXHR.responseText);
            }
      });

    }

    

    this.sendDataAndCallBackSimple = function(url, urlData, callBack)
    {
      var requestUrl = url;
        
      if(!requestUrl.includes("http"))
      {
        requestUrl = this.config.rootUrl + url;
      }
      

      urlData = this.addUserAuth(urlData);

      if(dataHandler.debugAjax) console.log("dataHandler.sendDataAndCallBack(): sending", urlData, url);

      dataHandler.startAjax();

      $.ajax({
        type: "GET",
        url: requestUrl,
        data:urlData,
        complete: function () {
            dataHandler.ajaxOff();
        },
        success: function(dataPacket) {
          callBack(dataPacket);
          dataHandler.endAjax();
        }
        ,error: function(jqXHR, exception) {
            console.error("AJAX Issue:" + jqXHR.responseText);
            }
      });

    }




      this.sendData = function(url, urlData)
      {

        var requestUrl = url;
        
        if(!requestUrl.includes("http"))
        {
          requestUrl = this.config.rootUrl + url;
        }


        if(dataHandler.debugAjax) console.log("dataHandler.sendData(): sending", urlData);

        dataHandler.startAjax();

        urlData = this.addUserAuth(urlData);

        $.ajax({
          type: "GET",
          url: requestUrl,
          data:urlData,
          complete: function () {
              dataHandler.ajaxOff();
          },
         success: function(data) {
                  
                if(dataHandler.debugAjax) console.log(data);

                if(dataHandler.error.errorMsg != "")
                {
                  console.error(dataHandler.error.errorMsg);
                }
           
                 dataHandler.endAjax();
              }
          ,error: function(jqXHR, exception) {
             console.error("AJAX Issue:" + jqXHR.responseText);
              }
        });

      }


      this.isJsonString = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}