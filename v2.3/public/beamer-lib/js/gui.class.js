function BeamerGui()
{
    this.showHeaderFlag = true;
    this.showFooterFlag = true;
    this.showClickAreas = false;
    this.defaultFont = "bold 12px sans-serif";
    this.defaultDebugFont = "10px sans-serif";
    this.defaultFontColor = "white";
    this.defaultButtonColor = "white";
    this.defaultButtonFontColor = "black";

    this.defaultHeaderFont = "bold 16px sans-serif";
    this.defaultHeaderFontColor = "#333333";

    this.defaultHelpBackgroundColor = "#333333";
    this.defaultHelpFont = "10px sans-serif";
    this.defaultHelpFontColor = "black";

    this.defaultGrowlBackgroundColor = "#333333";
    this.defaultGrowlFontColor = "yellow";
    this.defaultGrowlFont = "12px sans-serif";

    this.keepRendering = false;

    this.renderLoop = "";

    this.canvas = "";
    
    this.targetFps = 60;

    this.clickArea = [];

    this.showMenu = true;

    this.growlMsg = "";
    this.growlTimer = 0;
    this.growlShowTime = 5 * 1000;
    this.growlX = 20;
    this.growlY = 75;
    this.growlWidth = this.screenWidth - 49;
    this.growlHeight = 30;

    this.gameMenu = "";

    this.panels = [];
    this.menus = [];
    this.menuItems = [];
    this.bottomMenu = [];
    this.debugMsg = [];

    this.footerButtons = [
        {"imgKey":"gui-map","action":"show-world-map"}
        ,{"imgKey":"gui-army","action":"open-army"}
        ,{"imgKey":"gui-battle","action":"create-battle"}];

    this.footerButtonWidth = 75;
    this.footerButtonHeight = 90;
    this.footerButtonImgWidth = 64;
    this.footerButtonImgHeight = 64;
    this.footerClickAreaSet = false;

    this.currentHelpTopic = "lobby";

    this.loadGui = function()
    {
        this.canvas = document.getElementById("main-game-canvas");

        //document.getElementById("div-new-user").style.visibility = "hidden";

        //document.getElementById("div-new-user-register").style.visibility = "hidden";

        inputHandler.bind();
        
        this.showView("view-game-canvas");

        this.orientationChange();

        this.resizeCanvas();

        this.startRendering();

        this.screenWidth =  this.getScreenWidth();
        this.screenHeight = this.getScreenHeight();

        
        this.growlX = 100;
        this.growlY = 80;
        this.growlWidth = this.screenWidth - 200;
        this.growlHeight = 30;

        this.gameMenu = new GameMenu();
        this.gameMenu.init();

        console.log("Game Inited");


    }

    this.reset = function()
    {
        this.panels = [];
        this.menus = [];
        this.buttons = [];
        this.clickArea = [];
    }


    this.setTopMenu = function(options)
    {
        var d = document.getElementById("top-menu");
        d.style.visibility = "visible";

        if(options.logoText)
        {
            document.getElementById("top-menu-logo-txt").innerHTML = options.logoText;
        }


        var html = "";
        
        for(var i=0;i<options.buttons.length;i++)
        {
            var button = options.buttons[i];
            var img = assets.getImg(button.imgKey);

            html+= "<a href='javascript:play.processAction(\"" + button.actionKey + "\");void(0);'><img src='" + img.imgSrc + "'></a>";
        }

        document.getElementById("top-menu-buttons").innerHTML = html;
    }

    this.loadMenu = function()
    {
        this.gameMenu = new GameMenu();
        this.gameMenu.init();
    }

    this.closeMenu = function(){if(this.gameMenu != "") this.gameMenu.closeMenu();}

    this.setMessage = function(msg)
    {
        document.getElementById("div-splash-msg").innerHTML = msg;
    }

    this.setLoadingScreenMsg = function(msg)
    {
        document.getElementById("div-loading-msg").innerHTML = msg;
        document.getElementById("div-splash-msg").innerHTML = msg;
    }


    this.growl = function(msg)
    {
        this.growlTimer = setTimeout("beamerGui.clearGrowl()", this.growlShowTime);

        this.growlMsg = msg;
    }

    this.clearGrowl = function()
    {
        this.growlMsg = "";

    }


    this.showHeader = function()
    {
        this.showHeaderFlag = true;

    }

    this.hideHeader = function()
    {
        this.showHeaderFlag = false;
        
    }

    this.hideFooter = function()
    {
        this.showFooterFlag = false;  
        
        this.clearFooterClickAreas();
    }
    
    this.showFooter = function()
    {
        this.showFooterFlag = true;

        this.addFooterClickArea();
    }

    this.setFooterButtons = function(btns)
    {
        this.footerButtons = btns;

        this.footerClickAreaSet = false;
        //this.addFooterClickArea();

    }
    
    
    this.addFooterClickArea = function()
    {
        /*
        var drawX = (this.screenWidth/2) - ((this.footerButtons.length * this.footerButtonWidth)/2);
        var drawY = this.screenHeight - 95;

        for(var i=0;i<this.footerButtons.length;i++)
        {
            this.addClickArea(drawX, drawY, this.footerButtonWidth,this.footerButtonHeight, this.footerButtons[i].action);
            drawX+=80;//this.footerButtonWidth + 5;
        }
        */


    }

        
    this.clearFooterClickAreas = function()
    {
        this.clearClickAreasLike("footer-");

    }

    
    this.disableClickArea = function(clickKey)
    {
        for(var i=0;i<this.clickArea.length;i++)
        {
            if(this.clickArea[i].clickKey == clickKey)
            {
                this.clickArea[i].disabled = true;
            }
        }
    }




    this.processAction = function(actionKey)
    {
        
        if(actionKey.includes("open-menu-"))
        {
            var menuKey = actionKey.substring(10);

            this.toggleMenu(menuKey);
            
        }


        /*
        if(actionKey.includes("menu-toggle-"))
        {
            var menuKey = actionKey.substring(12);

            this.debug("Opening menu: " + menuKey);

            this.toggleMenu(menuKey);
            
        }
        */

        if(actionKey == "menu-open-help")
        {
            help.showHelpTopic(beamerGui.currentHelpTopic);   
            
            beamerGui.closeMenu();
        }


        if(actionKey == "get-prior-help")
        {
            help.getPrior();            
        }

                
        if(actionKey == "close-help")
        {
            help.closeHelp();      
        }

        
        if(actionKey == "get-next-help")
        {
            help.getNext();            
        }

        
        if(actionKey == "debug-clicks")
        {
            if(this.showClickAreas)
            {
                this.showClickAreas = false;
            }
            else
            {
                this.showClickAreas = true;
                
            }
        }

        
        
        if(actionKey == "debug-tiles")
        {
            if(play.config.debugGameTiles)
            {
                play.config.debugGameTiles = false;
            }
            else
            {
                play.config.debugGameTiles = true;
                
            }
        }


        if(actionKey == "debug-map")
        {
            if(play.config.debugMap)
            {
                play.config.debugMap = false;
            }
            else
            {
               play.config.debugMap = true;
            }
        }


        if(actionKey == "debug-all")
        {
            if(this.showClickAreas)
            {
                this.showClickAreas = false;
                play.config.debugGameTiles = false;
                play.config.debugMap = false;
            }
            else
            {
                this.showClickAreas = true;
                play.config.debugGameTiles = true;
                play.config.debugMap = true;
            }
        }


        if(actionKey == "toggle-click-areas")
        {
            if(this.showClickAreas) 
            {
                this.showClickAreas = false;
            }
            else
            {
                this.showClickAreas = true;
            }
            
        }

        if(actionKey.includes("close-panel-"))
        {
            var panelKey = actionKey.substring(12);

            this.closePanel(panelKey);
            
        }


        play.processAction(actionKey);
    }

    this.render = function()
    {
        if(!beamerGui.keepRendering) return;

        var canvas = beamerGui.canvas;

        var context = canvas.getContext("2d");

        beamerGui.clearRender(context);       
       
        play.render(context);        


        if(typeof play.view.render !== undefined) play.view.render(context);


        for(var i=0;i<beamerGui.panels.length;i++)
        {
            beamerGui.panels[i].render(context);
        }

        for(var i=0;i<beamerGui.bottomMenu.length;i++)
        {
            beamerGui.bottomMenu[i].render(context);
        }


        //for(var i=0;i<beamerGui.menuItems.length;i++)
        //{
        //    beamerGui.menuItems[i].render(context);
        //}

        
        for(var i=0;i<beamerGui.menus.length;i++)
        {
            beamerGui.menus[i].render(context);
        }
        

        if(beamerGui.growlMsg != "")
        {
            context.fillStyle = beamerGui.defaultGrowlBackgroundColor;
            context.fillRect(beamerGui.growlX + 20, beamerGui.growlY, beamerGui.growlWidth - 20, beamerGui.growlHeight);
            context.fillStyle = beamerGui.defaultGrowlFontColor;
            context.font = beamerGui.defaultGrowlFont;
            context.fillText(beamerGui.growlMsg, beamerGui.growlX + 30, beamerGui.growlY + 20);

        }


        if(typeof help.render !== "undefined") help.render(context);

        if(beamerGui.showClickAreas)
        {
            beamerGui.renderClickAreas(context);
        }

    }

    
    this.renderHeader = function(context)
    {
        context.fillStyle = this.getMainBackgroundColor();
        context.fillRect(0,0,this.screenWidth, 50);

        context.font = "bold 14px Arial";
        context.fillStyle = this.getMainColor();
        context.fillText(user.getUserName().toUpperCase(), 10,30);
        
        
        var img = assets.getImg("gui-icon-trophy").img;
        context.drawImage(img, 0,0,img.width,img.height,100,10,25,25);

        context.font = "bold 12px Arial";
        context.fillText(user.getStats().score, 130,30);

        var img = assets.getImg("gui-icon-treasure-box").img;
        context.drawImage(img, 0,0,img.width,img.height,150,10,25,25);

        context.font = "bold 12px Arial";
        context.fillText("$" + user.getStats().coin, 180,30);

        var drawX = this.screenWidth - 180;
        var drawY = 10;
        var drawWidth = 0;
        var drawHeight = 0;
        
        //this.drawButton(context, drawX, drawY, 100, "Menu");


    }

    
    this.renderFooter = function(context)
    {

        context.fillStyle = this.getMainBackgroundColor();
        context.fillRect(0,this.screenHeight - 100, this.screenWidth, 100);


        var drawX = (this.screenWidth/2) - ((this.footerButtons.length * this.footerButtonWidth)/2);
        var drawY = this.screenHeight - 95;
        context.fillStyle = this.getMainColor();
        context.strokeStyle = this.getSecondaryColor();

        if(!this.footerClickAreaSet)
        {
            this.clearClickAreasLike("footer-");
        }

        for(var i=0;i<this.footerButtons.length;i++)
        {
            var img = assets.getImage(this.footerButtons[i].imgKey).img;
            context.drawImage(img, 0,0,img.width, img.height, drawX + 5, drawY, this.footerButtonWidth, this.footerButtonHeight);
            

            if(!this.footerClickAreaSet)
            {
                this.addClickArea(drawX, drawY, this.footerButtonWidth,this.footerButtonHeight, "footer-" + this.footerButtons[i].action);
            }

            drawX += this.footerButtonWidth + 5;

            
        }

        this.footerClickAreaSet = true;
    }



    this.renderClickAreas = function(context)
    {
        
        context.strokeStyle = "red";
        context.fillStyle = "white";
        context.lineWidth = 5;

        for(var i=0;i<beamerGui.clickArea.length;i++)
        {
            if(!beamerGui.clickArea[i].disabled)
            {
                context.strokeRect(beamerGui.clickArea[i].minX, beamerGui.clickArea[i].minY, beamerGui.clickArea[i].width, beamerGui.clickArea[i].height);
                context.fillRect(beamerGui.clickArea[i].maxX, beamerGui.clickArea[i].maxY, 5,5);
                context.fillStyle = "white";
                context.font = "10px Arial";
                context.fillText(i + ":" + beamerGui.clickArea[i].clickKey + "-" + beamerGui.clickArea[i].minX + "," + beamerGui.clickArea[i].minY, beamerGui.clickArea[i].minX, beamerGui.clickArea[i].minY)
            }
        }
        context.lineWidth = 1;

    }



    
    this.getClickArea = function(action)
    {
        for(var i=0;i<beamerGui.clickArea.length;i++)
        {
            if(!beamerGui.clickArea[i].disabled && beamerGui.clickArea[i].clickKey == action)
            {
                return beamerGui.clickArea[i];
            }
        }
        
        return false;

    }

    
    this.addClickArea = function(x, y, w, h, action)
    {
        var a = {
                    minX:x
                    ,minY:y
                    ,maxX:x+w
                    ,maxY:y+h
                    ,width:w
                    ,height:h
                    ,clickKey:action
                    ,disabled: false
                };

        this.clickArea.push(a);
    }



    this.clearClickables = function(actionKey)
    {
        this.clickArea = [];     
    }


    this.clearClickArea = function(actionKey)
    {
        if(actionKey == undefined)
        {
            this.clickArea = []
        }

        for(var i=0;i<this.clickArea.length;i++)
        {
            if(this.clickArea[i].clickKey == actionKey)
            {
                this.clickArea[i].disabled = true;
            }
        }

    }


    this.clearClickAreasLike = function(actionKey)
    {

        for(var i=0;i<this.clickArea.length;i++)
        {
            var strLen = actionKey.length;

            if(this.clickArea[i].clickKey.substring(0,strLen) == actionKey)
            {
                this.clickArea[i].disabled = true;
            }
        }

    }    
    

    this.wasClickAreaClicked = function(mouseX, mouseY)
    {

        for(var i=0;i<this.clickArea.length;i++)
        {
            var c = this.clickArea[i];
            if(!c.disabled)
            {
                if(mouseX > c.minX && mouseX < c.maxX && mouseY > c.minY && mouseY < c.maxY)
                {
                    console.log("ACTION: " + c.clickKey);
                    this.processAction(c.clickKey);
                    return true;
                }
            }
        }

        return false;
    }

    this.mouseClicked = function(mouseX, mouseY)
    {
        this.wasClickAreaClicked(mouseX, mouseY);

        if(typeof play.view.mouseClicked !== undefined) play.view.mouseClicked(mouseX, mouseY);

    }

    
    this.mouseDown = function(mouseX, mouseY)
    {
        this.wasClickAreaClicked(mouseX, mouseY);
        
        if(typeof play.view.mouseDown !== undefined) play.view.mouseDown(mouseX, mouseY);

    }

        
    this.mouseMoved = function(mouseX, mouseY)
    {
        if(typeof play.view.mouseMoved !== undefined) play.view.mouseMoved(mouseX, mouseY);

    }

    this.mouseUp = function(mouseX, mouseY)
    {
        if(typeof play.view.mouseUp !== undefined) play.view.mouseUp(mouseX, mouseY);

    }





    this.tileClicked = function(tileX, tileY)
    {
        if(typeof beamerGui.currSubView.tileClicked !== undefined) beamerGui.currSubView.tileClicked(tileX, tileY);

    }

    
    this.getMainBackgroundColor = function() { return "#474747"};



    this.clearRender = function(context)
    {
        
        context.clearRect(0,0,this.canvas.width,this.canvas.height);     
        context.fillStyle = "#222222";
        context.fillRect(0,0,this.canvas.width, this.canvas.height);
    }

    this.startRendering = function()
    {
        if(!this.keepRendering)
        {
            this.renderLoop = setInterval("window.requestAnimationFrame(beamerGui.render)",1000 / this.targetFps);
            this.keepRendering = true;
        }
    }

    this.stopRendering = function()
    {
        this.keepRendering = false;
        clearInterval(this.renderLoop);
    }



    this.loadAssets = function()
    {
        var assetList = gameAssets.getAssetList();
        for(var i=0;i<assetList.length;i++)
        {
            var a = assetList[i];

            assets.addAsset({key:a.key,imgSrc:a.imgSrc});
        }
                        
    }


    this.getColor = function(colorName) 
    {
        var d = document.getElementById("gui-lookup-" + colorName);
        var style = getComputedStyle(d);
        return style["background-color"];
    }

    this.orientationChange = function() {

        switch(window.orientation) {  
        case -90 || 90:
            debug("Landscape Detected");
            beamerGui.resizeCanvas({canvasID:this.canvasID});
            break; 
        default:
            debug("Portrait Detected");
            beamerGui.resizeCanvas({canvasID:this.canvasID});
            break; 
        }
    }



    this.showLoadingScreen = function(data)
    {
        console.log("gui.showLoadingScreen() - loading Loading Screen");
        
        if(data['msg'] != "") 
        {
            document.getElementById("div-loading-msg").innerHTML = data['msg'];
        }


        this.showView("view-loading");


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

    this.getPrimaryColor = function() {return this.getMainColor();}
    this.getMainColor = function() {return "#865640"}
    this.getSecondaryColor = function() {return "#E2E0FF"}

    this.drawButton = function(context, param)
    {
        //beamerGui.drawButton(context, {label:"",drawX:20,drawY:20,drawWidth:100});
        drawX = param.drawX;
        drawY = param.drawY;
        drawWidth = param.drawWidth;
        drawHeight = 30;

        
        context.fillStyle = this.defaultButtonColor;
        context.strokeStyle = this.defaultButtonColor;
        this.drawRoundRect(context, drawX, drawY, drawWidth, drawHeight, 5, true, true);

        context.font = this.defaultFont;
        context.fillStyle = this.defaultButtonFontColor;
        context.fillText(param.label, drawX + 20, drawY + 20);

    }

    this.swipe = function(dir, amt){}
    
    /*
    this.drawButton = function(context, x, y, w, label)
    {
        
        context.fillStyle = this.getMainColor();
        context.strokeStyle = this.getSecondaryColor();
        this.drawRoundRect(context, x, y, w, 30, 5, true, true);

        context.fillStyle = this.getSecondaryColor();
        context.font = "bold 12px Arial";
        context.fillText(label, x + 20, y+ 20);

    }
    */

    this.drawMeter = function(context, label, color, drawX, drawY, val, maxVal )
    {
        context.font = "bold 8px Arial";
        context.fillStyle = this.getMainColor();
        context.fillText(label, drawX, drawY);
        drawX+=30;
        drawY-=5;
        meterWidth=3;
        meterHeight = 5;
        for(var i=0;i<maxVal;i++)
        {
            context.fillStyle = beamerGui.getMainBackgroundColor();
            context.fillRect(drawX + (i * (meterWidth +1)), drawY, meterWidth, meterHeight);

            if(i < val)
            {
                context.fillStyle = color;
                context.fillRect(drawX + (i * (meterWidth +1)), drawY, meterWidth, meterHeight);
            }
        }
    }

    this.drawRoundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
          stroke = true;
        }
        if (typeof radius === 'undefined') {
          radius = 5;
        }
        if (typeof radius === 'number') {
          radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
          var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
          for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
          }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
          ctx.fill();
        }
        if (stroke) {
          ctx.stroke();
        }
      
      }



  

    this.wrapTextAndRender = function(context,text, x, y, lineHeight, maxWidth) 
    {
        var lines = this.wrapText(context, text, maxWidth);
        
        for(var i=0;i<lines.length;i++)
        {
            context.fillText(lines[i], x,y + (i * lineHeight));
        }
    }

    this.wrapText = function(context, text, maxWidth) {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }

        lines.push(currentLine);

        return lines;
    }

    this.resizeCanvas = function() 
    {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    this.getScreenCenterX = function(){return this.viewWidth()/2;}
    this.getScreenCenterY = function(){return this.viewHeight()/2;}
    this.getScreenWidth = function(){return this.viewWidth();}

    this.getScreenHeight = function(){return this.viewHeight();}

    this.viewWidth = function()
    {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    }

    this.viewHeight = function()
    {
        return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    }

    this.getMenuBottomY = function() {return 105;}

    
    this.addMenu = function(options)
    {
            var m = new BeamerMenu(options);

            this.menus.push(m);
    }

    this.clearGui = function()
    {
        this.menus = [];

        this.panels = [];

        this.bottomMenu = [];

    }

    this.toggleMenu = function(menuKey)
    {
        this.debug("Finding menu: " + menuKey);

        for(var i=0;i<this.menus.length;i++)
        {

            
            if(this.menus[i].config.menuTriggerKey == menuKey)
            {
                if(this.menus[i].visible)
                {
                    this.menus[i].close();
                    
                    this.debug("...closing");
                }
                else
                {
                    this.menus[i].open();
                    this.debug("...opening");
                }
            }
            else
            {
                this.menus[i].close();
            }
        }
    }

    this.addMenuItem = function(options)
    {
            var m = new BeamerMenuItem(options);

            this.menuItems.push(m);
    }

    this.addPanel = function(options)
    {
        var p = new BeamerPanel(options);
        this.panels.push(p);

    }

    this.closePanel = function(panelKey)
    {
        var idx = -1;

        for(var i=0;i<this.panels.length;i++)
        {
            if(this.panels.panelKey = panelKey)
            {
                idx = i;
            }
        }

        if(idx >= 0)
        {
            this.panels[idx].close();
            this.panels.splice(idx, 1);
        }
    }

    
    this.addToBottomMenu = function(params)
    {
        params.drawX = this.screenWidth - (this.bottomMenu.length * 34) - 34;
        
        params.drawY = this.screenHeight - 50;

        var item = new BeamerMenuItem(params);

        this.bottomMenu.push(item);

        //{"actionKey":"toggle-quest-panel","imgKey":"gui-icon-settings"});
    }

    this.drawScaledImage = function(context, img, drawX, drawY, pctScale)
    {
        var drawWidth = img.width * pctScale;
        var drawHeight = img.height * pctScale;

        context.drawImage(img, 0,0,img.width, img.height,drawX, drawY, drawWidth, drawHeight);
    }

    this.debug = function(msg)
    {
        console.log(msg);
        this.debugMsg.push(msg);
    }

}
