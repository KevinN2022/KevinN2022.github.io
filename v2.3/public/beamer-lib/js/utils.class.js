function BeamerUtils()
{
    this.numGenObjs = 0;

    this.color = [];
    
    
    this.createGuid = function() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
      
      
      
    
    this.formatDateID = function(dateID, formatKey)
    {
      var out = "";
      
      out =  dateID.substring(4,6) + "/" + dateID.substring(6,8) + "/" + dateID.substring(0,4);

      if(formatKey == "short")
      {
        out = this.formatDateIDToShortDate(dateID);
      }

      return out;
    }


    this.formatDateIDToShortDate = function(dateID)
    {
      var out = "";

      out = dateID.substring(4,6) + "/" + dateID.substring(6,8);

      return out;
    }

    this.popNearMouse = function(divID)
    {
      var panel = document.getElementById(divID);

      var mousePos = inputHandler.getLastMouseClickPos();
      
      //console.log(mousePos.x + "," + mousePos.y);

      var displayX = (mousePos.x + 25);
      var displayY = (mousePos.y + 20);

      if(mousePos.x > this.getScreenWidth() * .80)
      {
        displayX = (mousePos.x - panel.offsetWidth - 25);
      }

      
      
      panel.style.left = displayX + "px";
      panel.style.top = displayY + "px";
      panel.style.visibility = "visible";

      
    }

    

    this.growl = function(msg, showTimeSecs)
    {
      var d = document.getElementById("div-growl");
      
      if(!d)
      {
        console.error("Growl div does not exists");
        return;
      }

      d.style.visibility = "visible";
      
      document.getElementById("div-growl-contents").innerHTML = msg;

      window.setTimeout(utils.hideGrowl, showTimeSecs * 1000);

    }

    this.hideGrowl = function()
    {
      var d = document.getElementById("div-growl");
      
      if(!d)
      {
        console.error("Growl div does not exists");
        return;
      }

      d.style.visibility = "hidden";
    }
      
    
    this.loadView = function(viewDivID) {this.showView(viewDivID);}
    this.showView = function(viewDivID)
    {
        var i;
        var x = document.getElementsByClassName("view");
        for (i = 0; i < x.length; i++) 
        {
            x[i].style.display = "none"; 
        }
        var d = document.getElementById(viewDivID);
        
        if(d)
        {
            document.getElementById(viewDivID).style.display = "block"; 
        }
        else
        {
            debug("Something went wrong...(view:" + viewDivID + " not found)");
        }        

        console.log("gui.showView(" + viewDivID + ")");


    }



    this.closePopPanel = function()
    {
      var panel = document.getElementById("div-pop-panel");
      panel.style.visibility = "hidden";
    }

    
    this.buildVertTablePanel = function(panelData)
    {
        var html = "<section class='panel'>";
        html+="<header class='panel-heading'>";
        html+=panelData.header;
        html+="</header>";
        
        if(panelData.desc !== undefined)
        {
          html+="<div class='panel-body' style='font-size: 10px;'>";

          html+= panelData.desc;

          html+="</div>";

        }
        html+="<div class='panel-body table-responsive'>";

        html+= this.buildVertTable(panelData.data, panelData.options);

        html+="</div>";

        return html;
                           
    }


    this.buildTablePanel = function(panelData)
    {
        var html = "<section class='panel'>";
        html+="<header class='panel-heading'>";
        html+=panelData.header;
        html+="</header>";
        
        if(panelData.desc !== undefined)
        {
          html+="<div class='panel-body' style='font-size: 10px;'>";

          html+= panelData.desc;

          html+="</div>";

        }
        html+="<div class='panel-body table-responsive'>";

        html+= this.buildTable(panelData.data, panelData.options);

        html+="</div>";

        return html;
                           
    }

    this.getMetaData = function(data)
    {
      var fieldMetaData = [];

      var colCount = 0;

      for (var prop in data[0]) 
      {
        if (data[0].hasOwnProperty(prop)) 
        {
          var fieldMeta = {
            display: prop
            ,rawValue:prop
            ,format:"text"
            ,align:"left"
            ,isID: false
            ,isHidden: false
          }

          if(colCount == 0)
          {
            fieldMeta.isID = true;
            fieldMeta.isHidden = true;
          }

          if(fieldMeta.rawValue.includes("_DATEID"))
          {
            fieldMeta.format = "date";
            fieldMeta.display = fieldMeta.display.replaceAll("_DATEID","");
            fieldMeta.align = "right";
          }

          if(fieldMeta.rawValue.includes("_DATE_ID"))
          {
            fieldMeta.format = "date";
            fieldMeta.display = fieldMeta.display.replaceAll("_DATE_ID","");
            fieldMeta.align = "right";
          }


          if(fieldMeta.rawValue.includes("_NUM"))
          {
            fieldMeta.format = "number";
            fieldMeta.display = fieldMeta.display.replaceAll("_NUM","");
            fieldMeta.align = "right";
          }

          if(fieldMeta.rawValue.includes("_AMT"))
          {
            fieldMeta.format = "currency";
            fieldMeta.display = fieldMeta.display.replaceAll("_AMT","");
            fieldMeta.align = "right";
          }

          if(fieldMeta.rawValue.includes("_PCT"))
          {
            fieldMeta.format = "percent";
            fieldMeta.display = fieldMeta.display.replaceAll("_PCT","");
            fieldMeta.align = "right";
          }

          fieldMeta.display = fieldMeta.display.replaceAll("_"," ");

          fieldMetaData.push(fieldMeta);
          
          colCount++;

        }
        
        
      }  
      
      return fieldMetaData;
    }

    this.buildTable = function(data, options)
    {

      if(options == undefined)
      {
        options = {
           "skipFirstColumn": false
          ,"is-clickable": false
        }
      }

      if(data.length <= 0)
      {
        var html = "No data found...";

        return html;
      }

      var style = "";
      if(options.tableStyle !== undefined)
      {
        style = options.tableStyle;
      }
      
      var html = "<table class='table table-hover' style='width:100%;" + style + "'>";
      html+= "<thead>";
      html+="<tr>";

      var fieldMetaData = this.getMetaData(data);

      for(var i=0;i<fieldMetaData.length;i++)
      {
        var meta = fieldMetaData[i];

        if(!meta.isHidden)
        {
          html+="<th style=\"text-align:" + meta.align + "\">" + meta.display + "</th>";
        }

        
      }
      
      html+="</tr>";
      html+="</thead>";

      for(var i=0;i<data.length;i++)
      {
        var colCount = 0;
        
        var row = data[i];       

        var meta_id = fieldMetaData[0];
        
        meta = fieldMetaData[colCount];
        
        if(options["is-clickable"] == "yes")
        {
          var link = options["link"];
          
          html+= "<tr onclick=\"" + link + "('" + row[meta_id.rawValue] + "')\">";
        }
        else
        {
          html+="<tr>";
        }


        for(var j=0;j<fieldMetaData.length;j++)
        {
          var meta = fieldMetaData[j];

          var display = row[meta.rawValue];

          if(meta.format == "date")
          {
              display = this.formatDateID(display);
          }

          if(meta.format == "currency")
          {
              display = this.formatCurrency(display);
          }

          if(meta.format == "number")
          {
              display = this.formatNumber(display);
          }

          if(meta.format == "percent")
          {
              display = this.formatPercent(display);
          }


          if(!meta.isHidden)
          {
            html+="<td style=\"text-align:" + meta.align + "\">" + display + "</td>";
          }
          
        }
     

        html+="</tr>";
      

      }

      html+="</table>";

      return html;
      
    }


    
    this.buildVertTable = function(data, options)
    {

      if(options == undefined)
      {
        options = {
           "skipFirstColumn": false
          ,"is-clickable": false
        }
      }

      if(data.length <= 0)
      {
        var html = "No data found...";

        return html;
      }

      var html = "<table class='table table-hover' style='width:100%;'>";

      var fieldMetaData = this.getMetaData(data);

      for(var i=0;i<fieldMetaData.length;i++)
      {
        var meta = fieldMetaData[i];
        
      }

      



      for(var j=0;j<fieldMetaData.length;j++)
      {
        var meta = fieldMetaData[j];

        
        if(meta.isHidden)
        {
          continue;
        }
        
        
        var label = data[0][meta.rawValue];
        var display = data[0][meta.rawValue];

        if(meta.format == "date")
        {
            display = this.formatDateID(display);
        }

        if(meta.format == "currency")
        {
            display = this.formatCurrency(display);
        }

        if(meta.format == "number")
        {
            display = this.formatNumber(display);
        }

        if(meta.format == "percent")
        {
            display = this.formatPercent(display);
        }

        html+="<tr>";
        html+="<td>" + meta.display + "</td>";
        html+="<td style=\"text-align:" + meta.align + "\">" + display + "</td>";
        html+="</tr>";
        
        
      }
     

      html+="</table>";

      return html;
      
    }



    this.formatCurrency = function(x)
    {
      return formatter.format(x);
    }


    this.formatNumber = function(x)
    {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    this.formatPercent = function(x)
    {
      return parseFloat(x*100).toFixed(2) + "%";
    }

    this.getScreenWidth = function()
    {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }


    this.getScreenHeight = function()
    {
      return window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
    }    

    this.ajaxOn = function(){}
    this.ajaxOff = function(){}

}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
