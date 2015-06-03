/** @constructor */
var HAniS = new function() {
  var controls, bottomControls, firstlast, first, last,
  pointer, debug, popupWindow, debugWindow, debugText, buttcss,
  ptr, divall, divcan, divcanStyle, imgCan, ctx, ctx1, drwCan, ctxd,
  numFrames, backFiles, numOverlays, overlayFiles, overlayLabels,overlayOrder,
  overlayLinks, imageBase, configImageBase, backImages, overlayImages, 
  overlayCheck, overlayAlpha, overlayStatic, showTip, tipText, tipX, tipY,
  overlayClear, xScreen, yScreen, xImage, yImage, wImage, hImage, xMove,yMove,
  isRunning, isLooping, wasLooping, curFrame, direction, isRocking,
  fetchImages, needSizes, configValues, dwell, minDwell, maxDwell,
  stepDwell, lastDwell, delay, 
  enhance, enhTab, isBaseEnh, isOverlayEnh, overlayEnhNum, 
  enhCan, origCan, ctxe, ctxo, origIDd, enhID,
  toggleFrames, wTog, hTog, spTog, divtog, togstart, togPointer,
  hotspots, numHotspots, isIconHotspot, backStatic,
  prevNumHotzones, numHotzones, hotzones, rgb, rgbpack,
  hoverzones, numHoverzones, doHoverzones, gotHoverzones, hoverCan, ctxh,
  hoverInx, showedHover, allowHoverzones, okToShowHoverzones,
  hiResZoomLevel, hiResZoomIndex, hiResBase, hiResBaseName, 
  hiResOlay, hiResOlayName, doingHiResZoom, frameLabels, frameLabelField,
  hiResOlayIndex, useToggle, cantog, ctxtog, gotImages, doFOF,
  startstop, forward, backward, setSpeed, faster, slower, overlaySpacer,
  extrap, isExtrap, extrapMode, extrapX, extrapY, extrapT, extrapXbeg,
  extrapPrompts, extrapHbeg, extrapTB, extrapTimes, exsign, dxdt, dydt, dt,
  extrapTimesTemplate, minutes, doTime, xInc, yInc, tmin, nmin, exMsg,
  startingMinute, utcOffset, tzLabel, timeColor, timeBack, timeFont, 
  timeFontSize, extrapAMPM, toFromLock, toFrom, 
  zoom, keepZoom, activeZoom, isDown,
  zoomScale, zoomXFactor, zoomYFactor, zoomXBase, zoomYBase, 
  isInitialZoom, initialZoom, enableZooming, zoomFactorMax, isDragging,
  looprock, setframe, setframeLabel, setframeLabelSpan, isSetframe, distance, 
  doDistance, doDirection, x0Dist, y0Dist, distDigits, distShift, 
  xText, yText, wText, hText,
  x1Dist, y1Dist, distBox, distLineColor,
  showDistance, distXScale, distYScale, distUnit, tipBox,
  preserveBackPoints, olayZoomIndex, preserveIndex, preservePoints,
  refresh, autotoggle, popupDiv, popupWinWidth, popupWinHeight,
  overlayProbe, showProbe, doProbe, probe, tabGray, gotEnhTable,
  gotProbeTable, tabUnit, tabPrefix, tabDecimal, minx, minDiff, probeBox, 
  dirspdBox, dirspdPrefix, dirspdSuffix, dirspdLabel, dirspdX, dirspdY,
  diffInx, diffPct, pct, m1, m2, drgb, tn, diff,
  tabVal, tabNum, tabDif, tabR, tabG, tabB, tabA, tabInx, tabMissing,
  lastFOF, isAutoRefresh, autoRefresh, refreshTimer, showProgress, 
  useProgress, progX, progY,imgGotCount, imgCount, hideBottom,
  hideBottomDef, hideTop, hideTopDef;
  
  var compass = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];

  var requestAnimationFrame = window.requestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(cb) {
       setTimeout(cb,10);
     };

  var make = function(t) {
    return document.createElement(t);
  };

  var nosel = "position:relative;border:0px;margin:0px;padding:0px;-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; -webkit-tap-heightlight-color:transparent;";

  this.setup = function(confn,divnam) {

    if (divnam == undefined) divnam = "MORdivcan";

    divall = document.getElementById(divnam);
    divall.align="center";

    divcan = make("div");
    divcan.setAttribute("style", nosel);

    imgCan = make("canvas");
    imgCan.setAttribute("style","position:absolute;top:0;left:0;z-index:1;");

    drwCan = make("canvas");
    drwCan.setAttribute("style","position:absolute;top:0;left:0;z-index:2;");
    ctxd = drwCan.getContext("2d");
    ctxd.imageSmoothingEnabled = false;

    divcan.appendChild(imgCan);
    divcan.appendChild(drwCan);

    divall.appendChild(divcan);

    pointer = new PEvs(drwCan, HAniS.down, HAniS.up, 
         HAniS.move, HAniS.drag, null, HAniS.canTip);

    divall.setAttribute("tabindex",0);
    divall.addEventListener("keydown", function(e) {
      if (e.keyCode == 37) {
          setIsLooping(false); 
          incCurrentFrame(-1);
          drawIt();
      } else if (e.keyCode == 39) {
          setIsLooping(false); 
          incCurrentFrame(+1);
          drawIt();
      }
    }, true);

    curFrame = 0;
    isRocking = false;
    direction = +1;
    isLooping = true;
    wasLooping = true;
    numFrames = 0;
    numOverlays = 0;
    needSizes = true;
    overlayOrder = null;
    fetchImages = true;
    dwell = 500;
    minDwell = 100;
    maxDwell = 2000;
    stepDwell = 30;
    lastDwell = 0;
    autoRefresh = 60000;
    refreshTimer = null;
    isAutoRefresh = false;
    imageBase = null;
    configImageBase = null;
    zoomXFactor = 1.0;
    zoomYFactor = 1.0;
    zoomXBase = 1.0;
    zoomYBase = 1.0;
    isDragging = false;
    xScreen = 0;
    yScreen = 0;
    xImage = 0;
    yImage = 0;
    wImage = 0;
    hImage = 0;
    xMove = 0;
    yMove = 0;
    isDown = false;
    useToggle = false;
    numHotzones = 0;
    isIconHotspot=false;
    frameLabelField = null;
    imgCount = 0;
    imgGotCount = 0;
    progX = 0;
    progY = 0;
    gotImages = false;
    backStatic = false;
    showTip = false;
    x0Dist = y0Dist = x1Dist = y1Dist = 0;
    doDistance = false;
    showDistance = false;
    distShift = false;
    isSetframe = false;
    doHoverzones = false;
    okToShowHoverzones = true;
    allowHoverzones = null;
    hoverInx = -1;
    showedHover = false;
    doProbe = false;
    showProbe = false;
    gotProbeTable = false;
    gotEnhTable = false;
    m1 = [1,0,0];
    m2 = [2,2,1];
    drgb = [];
    overlayProbe = [];
    isExtrap = false;
    isBaseEnh = false;
    isOverlayEnh = false;
    enhTab = 0;
    exMsg = 0;
    utcOffset = 0;

    var can1 = make("canvas");
    can1.height=1;
    can1.width=1;
    ctx1 = can1.getContext("2d");
    ctx1.imageSmoothingEnabled=false;

    hoverCan = make("canvas");

    debug = false;
    if (confn.indexOf("\n") < 0) {
      getConfig(confn);
    } else {
      parseConfig(confn.split("\n"));
    }


  }

  var parseConfig = function(txt) {
    var i,j, st, stt, sto;
    doFOF = true;
    configValues = {};
    for (i=0; i<txt.length; i++) {
      if (txt[i].length < 2) continue;
      st = txt[i].trim();
      if (st.indexOf("#") == 0) continue;
      if (st.indexOf("=") < 0) continue;

      stt = st.split("=");
      sto = stt[0].trim().toLowerCase();
      configValues[sto] = stt[1].trim();
    }

    debug = false;
    if (configValues["debug"] != null) {
      if (configValues["debug"] == "true") {
        debugWindow = window.open("","HAniSDebugInfo","scrollbars=yes,width=400,height=200");
        debug = true;
        info("HAniS Version 1.91");
      } else {
        debug = false;
      } 
    }

    distXScale = null;
    distYScale = null;
    if (configValues["map_scale"] != null) {
      doDistance = true;
      distShift = true;
      var a = configValues["map_scale"].split(",");
      distXScale = parseFloat(a[0]);
      if (a.length > 1) {
        distYScale = parseFloat(a[1]);
      } else {
        distYScale = distXScale;
      }
    }

    distUnit = " ";
    if (configValues["distance_unit"] != null) {
      distUnit = configValues["distance_unit"].trim();
    }

    divcanStyle = " ";
    if (configValues["divcan_style"] != null) {
      divcanStyle = configValues["divcan_style"].trim();
    }

    var distBGColor = "blue";
    var distFGColor = "white";
    var distFont = "12px Arial";
    var distScolor = null;
    var distSblur = 10;
    var distSxoff = 10;
    var distSyoff = 10;
    distDigits = 1;
    distLineColor = "white";
    if (configValues["distance_display_style"] != null) {
      var a = configValues["distance_display_style"].split(",");
      distBGColor = a[0].trim();
      distFGColor = a[1].trim();
      distLineColor = (a.length >= 5) ? a[4].trim() : distFGColor;
      distFont = a[2].trim();
      distDigits = parseInt(a[3],10);
      if (a.length > 5) {
        distScolor = a[5].trim();
        distSblur = parseInt(a[6], 10);
        distSxoff = parseInt(a[7], 10);
        distSyoff = parseInt(a[8], 10);
      }
    }

    distBox = new TextBox(distBGColor, distFGColor, distFont, 
        distScolor, distSblur, distSxoff, distSyoff);

    var probeBG= "black";
    var probeFG= "white";
    var probeFont = "12px Arial";
    var probeScolor = null;
    var probeSblur = 10;
    var probeSxoff = 10;
    var probeSyoff = 10;
    if (configValues["probe_display_style"] != null) {
      var a = configValues["probe_display_style"].split(",");
      probeBG = a[0].trim();
      probeFG = a[1].trim();
      probeFont = a[2].trim();
      if (a.length > 3) {
        probeScolor = a[3].trim();
        probeSblur = parseInt(a[4], 10);
        probeSxoff = parseInt(a[5], 10);
        probeSyoff = parseInt(a[6], 10);
      }
    }
    probeBox = new TextBox(probeBG, probeFG, probeFont, 
        probeScolor, probeSblur, probeSxoff, probeSyoff);

    if (configValues["pause"] != null) {
      lastDwell = parseInt(configValues["pause"],10);
    }

    if (configValues["auto_refresh"] != null) {
      autoRefresh= parseInt(configValues["auto_refresh"],10)*60000;
      refreshTimer = setInterval("HAniS.reloadFOF();",autoRefresh);
      isAutoRefresh = true;
    }

    if (configValues["overlay_labels"] != null) {
      overlayLabels = configValues["overlay_labels"].split(",");
    }

    isOverlayEnh = false;
    overlayEnhNum = -1;
    if (configValues["overlay_enhance"] != null) {
      isOverlayEnh = true;
      overlayEnhNum = parseInt(configValues["overlay_enhance"],10)-1;
    }

    allowHoverzones = null;
    okToShowHoverzones = true;
    if (configValues["overlay_allow_hoverzones"] != null) {
      var a = configValues["overlay_allow_hoverzones"].split(",");
      allowHoverzones = new Array(a.length);
      for (i=0; i<a.length; i++) {
        allowHoverzones[i] = true;
        if (a[i].trim().toLowerCase().indexOf("n") == 0 ||
            a[i].trim().toLowerCase().indexOf("f") == 0)   {
              
          allowHoverzones[i] = false;
        }
      }
    }

    overlaySpacer = null;
    if (configValues["overlay_spacer"] != null) {
      var a = configValues["overlay_spacer"].split(",");
      overlaySpacer = new Array(a.length);
      for (i=0; i<a.length; i++){
        overlaySpacer[i] = parseInt(a[i],10);
      }
    }

    if (configValues["overlay_probe_table"] != null) {
      var a = configValues["overlay_probe_table"].split(",");
      for (i=0; i<a.length; i++){
        overlayProbe[i] = parseInt(a[i],10) - 1;
      }
    }


    overlayOrder = null;
    if (configValues["overlay_order"] != null) {
      var a = configValues["overlay_order"].split(",");
      overlayOrder = new Array(a.length);
      for (i=0; i<a.length; i++){
        overlayOrder[parseInt(a[i],10) - 1] = i;
      }
    }

    overlayLinks = null;
    if (configValues["overlay_links"] != null) {
      var a = configValues["overlay_links"].split(",");
      overlayLinks = new Array(a.length);
      for (i=0; i<a.length; i++) {
        overlayLinks[i] = parseInt(a[i],10);
      }
    }

    overlayClear = null; // 'n', 'z', 's', 'r'
    if (configValues["overlay_clear"] != null) {
      var a = configValues["overlay_clear"].split(",");
      overlayClear = new Array(a.length);
      for (i=0; i<a.length; i++) {
        overlayClear[i] = a[i].trim().toLowerCase();
      }
    }

    overlayAlpha = null;
    if (configValues["overlay_transparent_amount"] != null) {
      var a = configValues["overlay_transparent_amount"].split(",");
      overlayAlpha = new Array(a.length);
      for (i=0; i<a.length; i++){
        overlayAlpha[i] = parseFloat(a[i])/100.0;
      }
    }

    olayZoomIndex = null;
    if (overlayLabels != null && configValues["overlay_zoom"] != null) {
      var a = configValues["overlay_zoom"].split(",");
      olayZoomIndex = new Array(a.length);
      for (i=0; i<a.length; i++) {
        olayZoomIndex[i] = true;
        if (a[i].trim().toLowerCase().indexOf("n") == 0 ||
            a[i].trim().toLowerCase().indexOf("f") == 0)   {
              
          olayZoomIndex[i] = false;
        }
      }
    }

    preserveIndex = null;
    if (overlayLabels != null && configValues["overlay_preserve_list"] != null) {
      var a = configValues["overlay_preserve_list"].split(",");
      preserveIndex = new Array(a.length);
      for (i=0; i<a.length; i++) {
        preserveIndex[i] = true;
        if (a[i].trim().toLowerCase().indexOf("n") == 0 ||
            a[i].trim().toLowerCase().indexOf("f") == 0)   {
              
          preserveIndex[i] = false;
        }
      }
    }

    utcOffset = 0;
    tzLabel = " ";
    timeColor = "white";
    timeBack = "transparent";
    timeFont = "14pt arial";
    extrapAMPM = false;
    // = color, utc_offset, tzoneLabel, backgnd, font, AMPM (true/false)
    if (configValues["times_label_style"] != null) {
      var a = configValues["times_label_style"].split(",");
      timeColor = a[0].trim();
      if (a.length > 1) 
      utcOffset = Math.floor(60. * parseFloat(a[1]));
      if (a.length > 1) {
        if (a[1].trim() == "?" || a[1].trim().toLowerCase() == "auto") {
          var dt = new Date();
          utcOffset = -Math.floor(dt.getTimezoneOffset());
        } else {
          utcOffset = Math.floor(60.  *parseFloat(a[1]));
        }
      }
      if (a.length > 2) tzLabel = a[2].trim();
      if (a.length > 3) timeBack = a[3].trim();
      if (a.length > 4) timeFont = a[4].trim();
      if (a.length > 5 && a[5].trim().indexOf("t")!=-1) extrapAMPM = true;
    }
    if (timeColor.indexOf("0x") == 0) {
      timeColor = "#"+timeColor.substring(2);
    }
    if (timeBack.indexOf("0x") == 0) {
      timeBack = "#"+timeBack.substring(2);
    }
    timeFontSize = parseInt(timeFont,10);
    extrapTB = new TextBox("black","white",timeFont, "black",20,5,5);

    toFromLock = false;
    toFrom = false;
    if (configValues["to_from_lock"] != null) {
      a = configValues["to_from_lock"].trim();
      if (a.indexOf("t") == 0) {
        toFrom = true;
      } else {
        toFrom = false;
      }
    }

    var dsboxBG = "black";
    var dsboxFG = "white";
    var dsboxFont = "14px arial";
    var dsboxScolor = null;
    var dsboxSblur = 10;
    var dsboxSxoff = 10;
    var dsboxSyoff = 10;
    dirspdSuffix = " ";
    dirspdPrefix = " ";
    dirspdLabel = null;
    dirspdBox = null;

    if (configValues["dirspd_display_style"] != null) {
      var a = configValues["dirspd_display_style"].split(",");
      // bg, fg, font, prefix, suffix, shadow color, blur, xoff,  yoff
      dsboxBG = a[0].trim();
      dsboxFG = a[1].trim();
      dsboxFont = a[2].trim();
      dirspdPrefix = a[3];
      dirspdSuffix = a[4];
      if (a.length > 5) {
        dsboxScolor = a[5].trim();
        dsboxSblur = parseInt(a[6], 10);
        dsboxSxoff = parseInt(a[7], 10);
        dsboxSyoff = parseInt(a[8], 10);
      }

      dirspdBox = new TextBox(dsboxBG, dsboxFG, dsboxFont,
          dsboxScolor, dsboxSblur, dsboxSxoff, dsboxSyoff);
    }

    var tipboxBG = "black";
    var tipboxFG = "white";
    var tipboxFont = "14px arial";
    var tipboxScolor = null;
    var tipboxSblur = 10;
    var tipboxSxoff = 10;
    var tipboxSyoff = 10;

    if (configValues["tipbox_display_style"] != null) {
      var a = configValues["tipbox_display_style"].split(",");
      // bg, fg, font, shadow color, blur, xoff,  yoff
      tipboxBG = a[0].trim();
      tipboxFG = a[1].trim();
      tipboxFont = a[2].trim();
      if (a.length > 3) {
        tipboxScolor = a[3].trim();
        tipboxSblur = parseInt(a[4], 10);
        tipboxSxoff = parseInt(a[5], 10);
        tipboxSyoff = parseInt(a[6], 10);
      }
    }

    tipBox = new TextBox(tipboxBG, tipboxFG, tipboxFont,
        tipboxScolor, tipboxSblur, tipboxSxoff, tipboxSyoff);

    preservePoints = null;
    if (overlayLabels != null && preserveIndex != null) {
      var a = configValues["overlay_preserve"].split(",");
      preservePoints = new Array(preserveIndex.length);
      var p = 0;
      for (i=0; i<preserveIndex.length; i++) {
        if (preserveIndex[i]) {
          preservePoints[i] = new Array(4);
          for (j=0; j<4; j++) {
            preservePoints[i][j] = parseInt(a[p].trim(), 10);
            p = p + 1;
          }
          // convert to width and height...
          preservePoints[i][2] = preservePoints[i][2] - preservePoints[i][0] + 1;
          preservePoints[i][3] = preservePoints[i][3] - preservePoints[i][1] + 1;
        }
         
      }
    }

    imageBase = configValues["image_base"];
    if (imageBase != null) {
      imageBase = imageBase.trim();
    } else {
      imageBase=null;
    }
    configImageBase = imageBase;

    doFOF = true;
    if (configValues["filenames"] != null) {
      var bfn = configValues["filenames"].split(",");
      numFrames = bfn.length;
      backFiles = new Array(numFrames);
      for (i=0; i<numFrames; i++) {
        if (imageBase != null) {
          backFiles[i] = imageBase+bfn[i].trim();
        } else {
          backFiles[i] = bfn[i].trim();
        }
      }
      doFOF = false;
      numOverlays = 0;
    }

    if (configValues["basename"] != null) {
      // basename and get num_frames & compute filenames
      // allow for base_starting_number
      // also, wildcards!!  (* means all digits, ??? means 3 digits)
      var bn = configValues["basename"];
      if (imageBase != null) {
         bn = imageBase+configValues["basename"];
      } 
      var bsv = configValues["base_starting_number"];
      if (bsv == null) bsv = 0;
      numFrames = configValues["num_frames"];
      if (numFrames == null) {
        numFrames = configValues["num_images"];
      }
      numFrames = parseInt(numFrames,10);
      backFiles = new Array(numFrames);
      var val;
      for (i=0; i<numFrames; i++) {
        val = i + parseInt(bsv,10);
        if (bn.indexOf("*") >= 0) {
          backFiles[i] = bn.replace("*", val);

        } else if (bn.indexOf("?") >= 0) {
          var subbn = bn;
          while ( subbn.lastIndexOf("?") >= 0) {
            var li = subbn.lastIndexOf("?");
            var ts = subbn.substring(0,li)+(val % 10) +subbn.substring(li+1);
            subbn = ts;
            val = Math.floor(val / 10);
          }
          backFiles[i] = subbn;
        } else {
          backFiles[i] = bn + i;
        }
        
        info("image filename = "+backFiles[i]);
      }

      doFOF = false;
      numOverlays = 0;
    }

    backStatic = true;
    var bst = configValues["background_static"];
    if (bst != null) {
      if (bst == "f" || bst == "false" || bst == "n") {
        backStatic = false;
      }
    }

    if (configValues["overlay_filenames"] != null) {
      // overlay_filenames = oA1 & oA2 & oA3, oB1 & oB2 & oB3....
      var a = configValues["overlay_filenames"].split(",");
      overlayFiles = new Array(numFrames);
      for (i=0; i<a.length; i++) {
        var b = a[i].split("&");
        numOverlays = a.length;
        for (j=0; j<numFrames; j++) {
        if (i == 0) overlayFiles[j] = new Array(numOverlays);

          overlayFiles[j][i] = b[j].trim();

          if (imageBase != null) {
            overlayFiles[j][i] = (imageBase+overlayFiles[j][i]).trim();
          }

        }
        
      }

      doFOF = false;
    }

    preserveBackPoints = null;
    if (configValues["image_preserve"] != null) {
      var a = configValues["image_preserve"].split(",");
      preserveBackPoints = new Array();
        for (i=0; i<a.length; i++) {
            preserveBackPoints[i] = parseInt(a[i].trim(), 10);
            // convert to width and height...
            if (i % 4 > 1) {
              preserveBackPoints[i] = 
                 preserveBackPoints[i] - preserveBackPoints[i-2] + 1;
            }
        }
    }
         
    keepZoom = true;
    if (configValues["keep_zoom"] != null) {
      if (configValues["keep_zoom"].trim().toLowerCase().indexOf("f") == 0) {
        keepZoom = false;
      }
    }

    hideBottomDef = 0;
    hideBottom = 0;
    if (configValues["hide_bottom"] != null) {
      hideBottomDef = parseInt(configValues["hide_bottom"].trim(),10);
    }

    hideTopDef = 0;
    hideTop = 0;
    if (configValues["hide_top"] != null) {
      hideTopDef = parseInt(configValues["hide_top"].trim(),10);
    }

    popupDiv = "<div>";
    popupWinHeight = 300;
    popupWinWidth = 500;
    if (configValues["popup_style"] != null) {
      var a = configValues["popup_style"];
      popupDiv = '<div style="'+configValues["popup_style"]+'">';
    }

    if (configValues["popup_window_size"] != null) {
      var a = configValues["popup_window_size"].split(",");
      popupWinWidth = a[0];
      popupWinHeight = a[1];
    }


    activeZoom = false;
    enableZooming = false;
    if (configValues["active_zoom"] != null) {
      if (configValues["active_zoom"].trim().toLowerCase().indexOf("t") == 0) {
        activeZoom = true;
        enableZooming = true;
      }
    }

    zoomScale = 1.0;
    if (configValues["zoom_scale"] != null) {
      zoomScale = parseFloat(configValues["zoom_scale"]);
    }

    zoomFactorMax = 9999999.0;
    if (configValues["maximum_zoom"] != null) {
      zoomFactorMax = parseFloat(configValues["maximum_zoom"]);
    }

    showProgress = true;
    if (configValues["use_progress_bar"] != null) {
      if (configValues["use_progress_bar"].trim().toLowerCase().indexOf("f") == 0) {
        showProgress = false;
      }
    }

    if (configValues["dwell"] != null) {
      var a = configValues["dwell"].split(",");
      dwell = parseInt(a[0].trim(), 10);
      if (a.length > 1) {
        minDwell = parseInt(a[1].trim(), 10);
        if (minDwell < 10) minDwell = 10;
        maxDwell = parseInt(a[1].trim(), 10);
        stepDwell = parseInt(a[1].trim(), 10);
      }

    } else if (configValues["rate"] != null) {
      var a = configValues["rate"].split(",");
      dwell = Math.round(10000./parseFloat(a[0].trim()));
      if (a.length > 1) {
        minDwell = Math.round(10000./parseFloat(a[2].trim()));
        if (minDwell < 10) minDwell = 10;
        maxDwell = Math.round(10000./parseFloat(a[1].trim()));
      }
    }

    extrapTimes = null;
    if (configValues["times"] != null) {
      var a = configValues["times"].split(",");
      extrapTimes = new Array(a.length);
      for (i=0; i<a.length; i++) {
        extrapTimes[i] = parseInt(a[i].trim(), 10);
      }
      makeTimes(extrapTimes);
    }

    extrapTimesTemplate = null;
    if (configValues["extrap_times_template"] != null) {
      extrapTimesTemplate = RegExp(configValues["extrap_times_template"]);
    }

    extrapPrompts = ["Click on target's initial position","Click on target's final position","Move pointer around or click here to select target"];

    if (configValues["extrap_prompts"] != null) {
      extrapPrompts = configValues["extrap_prompts"].split(",");
    }


    gotProbeTable = false;
    if (configValues["probe_table"] != null) {
      var reqpt = new XMLHttpRequest();
      tabVal = new Array();
      tabMissing = new Array();
      tabUnit = new Array();
      var tabPrevUnit = " ";
      tabPrefix = new Array();
      var tabPrevPrefix = "Value=";
      tabDecimal = new Array();
      var tabPrevDecimal = 1;
      tabDif = new Array(); // max diff in color 'tabInx', max of all
      tabInx = new Array();  // index (0=R, 1=G, 2=B) of max
      tabR = new Array(); // Red
      tabG = new Array(); // Green
      tabB = new Array(); // Blue
      var inx;
      var tabEnt = -1;
      tabNum = -1;
      var state = 0;

      reqpt.onload = function() {
        var txt = this.responseText.split("\n");
        for (var i=0; i<txt.length; i++) {
          if (txt[i].length < 2) continue;

          var sr = txt[i].replace(/\s+/g, ' ').trim();
          var st = sr.split(",");

          var sp = st[0].split(" ");

          if (sp[0].indexOf("*") == 0) {
            tabNum++;
            tabVal[tabNum] = new Array();
            tabPrefix[tabNum] = new Array();
            tabUnit[tabNum] = new Array();
            tabDecimal[tabNum] = new Array();
            tabR[tabNum] = new Array();
            tabG[tabNum] = new Array();
            tabB[tabNum] = new Array();
            tabInx[tabNum] = new Array();
            tabDif[tabNum] = new Array();
            tabEnt = -1;
            if (st.length > 1) {
              tabMissing[tabNum] = st[1].trim();
            } else {
              tabMissing[tabNum] = "None";
            }
            state = 1;
            continue;
          }
          if (state == 0) continue;

          tabEnt++;
          var dinx = new Array(3);
          tabVal[tabNum][tabEnt] = parseFloat(sp[0]);
          tabR[tabNum][tabEnt] = parseInt(sp[1].trim(),10);
          tabG[tabNum][tabEnt] = parseInt(sp[2].trim(),10);
          tabB[tabNum][tabEnt] = parseInt(sp[3].trim(),10);
          if (tabEnt != 0) {
            dinx[0] = tabR[tabNum][tabEnt] - tabR[tabNum][tabEnt-1];
            dinx[1] = tabG[tabNum][tabEnt] - tabG[tabNum][tabEnt-1];
            dinx[2] = tabB[tabNum][tabEnt] - tabB[tabNum][tabEnt-1];
            inx = 0;
            if (Math.abs(dinx[1]) > Math.abs(dinx[inx]) ) inx = 1;
            if (Math.abs(dinx[2]) > Math.abs(dinx[inx]) ) inx = 2;
            tabInx[tabNum][tabEnt-1] = inx;
            tabDif[tabNum][tabEnt-1] = dinx;
            if (tabDif[tabNum][tabEnt-1][inx] == 0) tabDif[tabNum][tabEnt-1][inx] = 1;
          }

          if (st.length > 1) {
            if (st[1].trim().indexOf('"') == 0) {
              tabPrevDecimal = -1;
              var ftb=st[1].trim();
              tabPrevPrefix = ftb.substr(1, ftb.length-2);
              tabPrevUnit = "";
            } else {
              tabPrevDecimal = parseInt(st[1],10);
              if (st.length > 2) tabPrevUnit = st[2].trim();
              if (st.length > 3) tabPrevPrefix = st[3].trim();
            }
          }
          tabPrefix[tabNum][tabEnt] = tabPrevPrefix;
          tabDecimal[tabNum][tabEnt] = tabPrevDecimal;
          tabUnit[tabNum][tabEnt] = tabPrevUnit;

        }
        gotProbeTable = true;
      }

      reqpt.open("get",configValues["probe_table"],true);
      reqpt.send();

    }

    controls = configValues["controls"];
    info("controls = "+configValues["controls"]);
    info("bottom_controls = "+configValues["bottom_controls"]);


    startstop = null;
    firstlast = null;
    forward = null;
    backward = null;
    faster = null;
    slower = null;
    refresh = null;
    autotoggle = null;

    if (controls != null) {
      doMakeControls(controls, true);
    }

    bottomControls = configValues["bottom_controls"];
    if (bottomControls != null) {
      doMakeControls(bottomControls, false);
    }

    if (doFOF) {
      HAniS.getFOF();
    } else {
      fetchImages = true;
      loadImages();
    }
  }

  var getConfig = function(fn) {
    var req = new XMLHttpRequest();
    req.onload = function() {
      parseConfig(this.responseText.split("\n"));
    }

    //req.open("get", fn, true);
    req.open("get", fn+"?"+Math.round(Math.random()*100000), true);
    req.send();
    
  }

  var clearOverlays = function(typ) {
    var i;
    if (overlayClear != null) {
      for (i=0; i<overlayClear.length; i++) {
        if (overlayClear[i].indexOf(typ) != -1) {
          overlayCheck[i].checked = false;
        }
      }
      for (i=0; i<overlayClear.length; i++) {
        resetLinks(i);
      }

    }
  }

  var makeTimes = function(s) {
    var ds = 0;
    minutes = new Array(s.length);
    for (var i=0; i<s.length; i++) {
      var mm = 60*Math.floor(s[i]/100) + Math.floor(s[i]) % 100;
      if (i == 0) startingMinute = mm;
      ds = mm - startingMinute;
      if (ds < 0) {  // test if gone over 00Z -- only allowed once!
        ds = mm + 24*60 - startingMinute;
      }
      minutes[i] = ds;
      info("times s="+mm+"  min="+minutes[i]);
    }
    startingMinute = startingMinute + utcOffset;
    if (startingMinute >= 1440) startingMinute = startingMinute - 1440;
    if (startingMinute < 0) startingMinute = startingMinute + 1440;
    info("Starting minute = "+startingMinute);
  }

  var setHotzoneVis = function(nz, vis) {
    if (nz != 0) {
      for (var i=0; i<nz; i++) {
        overlayCheck[hotzones[i].overlay].parentNode.style.visibility=vis;
      }
    }
  }

  this.reloadFOF = function() {
    info("reload FoF = "+refreshTimer);
    clearOverlays("r");
    if (doFOF) {
      HAniS.newFOF(configImageBase != null ? configImageBase+lastFOF : lastFOF);
    } else {
      fetchImages = true;
      loadImages();
    }
  }

  this.getFOF = function() {
    var fn = configValues["file_of_filenames"].trim();
    HAniS.newFOF(configImageBase != null ? configImageBase+fn : fn);
  }

  this.newFOF = function(fofn) {
    var i,j,k,m,n, fn = fofn;
    var req = new XMLHttpRequest();
    var st, stt, sto, stx, hro, hro2;
    prevNumHotzones = numHotzones;
    var fofext = null;
    gotImages = false;
    wasLooping = isLooping;
    isLooping = false;
    numFrames = 0;
    numHotzones = 0;
    backFiles = new Array();
    hotspots = null;
    numHotspots = 0;
    hoverzones = null;
    numHoverzones = 0;
    gotHoverzones = false;
    doHoverzones = false
    hiResZoomLevel = null;
    doingHiResZoom = false;
    hiResZoomIndex = -1;
    hiResBase = null;
    hiResBaseName = null;
    hiResOlay = null;
    hiResOlayName = null;
    hiResOlayIndex = -1;
    overlayFiles = new Array();
    var doTimes = false;
    if (extrapTimes == null || extrapTimesTemplate != null) {
      extrapTimes = new Array();
    }
    info("new FOF="+fn);
    if (isExtrap) {
      if (extrap != null) {
        extrap.innerHTML = extrap.label_on;
        divall.style.cursor = "default";
        isLooping = wasLooping;
        extrapMode = -1;
      }
      isExtrap = false;
      drawLines();
    } 

    req.onload = function() {
      var txt = this.responseText.split("\n");
      for (i=0; i<txt.length; i++) {
        if (txt[i].length < 2) continue;
        st = txt[i].trim();

        info("FOF: "+st);
        if (st.indexOf("#") == 0) continue;

        if (st.indexOf("fof_extension") == 0) {
          hro = st.split("=");
          fofext = hro[1].trim();
          continue;
        }

        if (st.indexOf("image_base") == 0) {
          hro = st.split("=");
          imageBase = hro[1].trim();
          continue;
        }

        if (st.indexOf("high_res_basemap") == 0) {
          hro = st.split("=");
          hro2 = hro[1].split(",");
          hiResBaseName = new Array();
          for (j=0; j<hro2.length; j++) {
            hiResBaseName[j] = hro2[j].trim();
            if (imageBase != null) {
              hiResBaseName[j] = imageBase+hiResBaseName[j]; 
            }
          }
          doingHiResZoom = true;
          continue;
        }
        if (st.indexOf("high_res_overlay") == 0) {
          hro = st.split("=");
          hro2 = hro[1].split(",");
          hiResOlayIndex = parseInt(hro2[0].trim(),10)-1;
          hiResOlayName = new Array();
          for (j=1; j<hro2.length; j++) {
            hiResOlayName[j-1] = hro2[j].trim();
            if (imageBase != null) {
              hiResOlayName[j-1] = imageBase+hiResOlayName[j-1]; 
            }
          }
          doingHiResZoom = true;
          continue;
        }

        if (st.indexOf("high_res_zoom") == 0) {
          hro = st.split("=");
          hro2 = hro[1].split(",");
          hiResZoomLevel = new Array();
          for (j=0; j<hro2.length; j++) {
            hiResZoomLevel[j] = parseFloat(hro2[j].trim());
          }
          setHiResZoomIndex();
          continue;
        }

        if (st.indexOf("hoverzone") == 0) {
          fetchHoverzone(st);
          continue;
        }

        if (st.indexOf("hotzone") == 0) {
          fetchHotzone(st);
          continue;
        }

        if (st.indexOf("hotspot") == 0) {
          fetchHotspot(st);
          continue;

        }

        if (st.indexOf("map_scale") == 0) {
          hro = st.split("=");
          hro2 = hro[1].split(",");
          distXScale = parseFloat(hro2[0]);
          if (hro2.length > 1) {
            distYScale = parseFloat(hro2[1]);
          } else {
            distYScale = distXScale;
          }
          continue;
        }

        if (st.indexOf("times") == 0) {
          hro = st.split("=");
          hro2 = hro[1].split(",");
          for (i=0; i<hro2.length; i++) {
            extrapTimes[i] = parseInt(hro2[i].trim(), 10);
          }
          doTimes = true;
          continue;
        }

        if (extrapTimesTemplate != null) {
          var ptimes = st.match(extrapTimesTemplate);
          if (ptimes != null && ptimes.length == 2) {
            extrapTimes.push(parseInt(ptimes[1],10));
            info("+ + + Extrap time = "+ptimes[1]);
            doTimes = true;
          } else {
            info("+ + + Cannot parse times using "+extrapTimesTemplate+" from line: "+st);
          }

        }

        k = st.indexOf(" ");
        if (k < 0) k = st.length;
        backFiles[numFrames] = st.substring(0,k).trim();
        if (imageBase != null) {
          backFiles[numFrames] = imageBase+backFiles[numFrames]; 
        }

        st = st.substring(k+1);
        m = st.indexOf('"');
        if (m >= 0) {
          if (frameLabels == null) {
            frameLabels = new Array();
          }
          k = st.substring(m+1);
          m = k.indexOf('"');
          if (m >= 0) {
            frameLabels[numFrames] = k.substring(0,m);
            if (numFrames == 0) {
              frameLabelField.innerHTML = frameLabels[0];
            }
          }
        }

        overlayFiles[numFrames] = new Array();

        m = st.indexOf("overlay");
        if (m >= 0) {
          stt = st.substring(m);
          m = stt.indexOf("=");
          if (m < 0) {
            info("Cannot find a = sign in "+stt);
          }
          sto = stt.substring(m+1);
          stt = sto.trim();
          sto = stt.split(",");
          numOverlays = sto.length;
          info("numOverlays set to "+numOverlays);

          for (n=0; n<sto.length; n++) {
            overlayFiles[numFrames][n] = sto[n].trim();
            if (imageBase != null) {
              overlayFiles[numFrames][n] = 
                   (imageBase+overlayFiles[numFrames][n]).trim(); 
            }
          }
        }

        numFrames = numFrames + 1;
      }

      if (doTimes) makeTimes(extrapTimes);

      if (fofext != null) {
        var reqx = new XMLHttpRequest();
        reqx.onload = function() {
          var txtx = this.responseText.split("\n");
          for (i=0; i<txtx.length; i++) {
            if (txtx[i].length < 2) continue;
            stx = txtx[i].trim();

            info("ext_FOF: "+stx);
            if (stx.indexOf("#") == 0) continue;

            if (stx.indexOf("hotzone") == 0) {
              fetchHotzone(stx);
              continue;
            }
          }

          readyToLoad();
        }

        reqx.onerror = function() {
          readyToLoad();
        }

        reqx.open("get", fofext+"?"+Math.round(Math.random()*100000), true);
        reqx.send();
        
      } else {
        readyToLoad();
      }
    }


    lastFOF = fofn;
    req.open("get", fn+"?"+Math.round(Math.random()*100000), true);
    req.send();

    
  }

  var readyToLoad = function() {
    if (numHotzones != 0) {
      setHotzoneVis(numHotzones, "visible");
    } else if (prevNumHotzones != 0) {
      setHotzoneVis(prevNumHotzones, "hidden");
    }

    fetchImages = true;
    loadImages();
  }

  var loadImages = function() {
    var i,j,k;
    var olayNotStatic = "?"+Math.round(Math.random()*10000);
    backImages = new Array(numFrames); 
    imgCount = imgGotCount = 0;
    useProgress = showProgress;
    if (isSetframe) setframe.max = numFrames - 1;
    if (needSizes && (isBaseEnh || isOverlayEnh)) {
      origCan = new Array();
      enhCan = new Array();
      ctxe = new Array();
      origIDd = new Array();
      enhID = new Array();
    }
    if (enhance != null) enhance.selectedIndex = 0;

    for (i=0; i<numFrames; i++){
      if (needSizes && (isBaseEnh || isOverlayEnh)) {
        origCan[i] = make("canvas");
        enhCan[i] = make("canvas");
      }
      backImages[i] = new Image();
      backImages[i].gotit = false;
      backImages[i].frameNum = i;
      backImages[i].onerror = function() {
        imgGotCount++;
      }

      backImages[i].onload = function() {

        if (needSizes) {
          needSizes = false;
          hImage = this.height;
          wImage = this.width;
          imgCan.height = hImage;
          imgCan.width = wImage;
          drwCan.height = hImage;
          drwCan.width = wImage;
          progX = wImage/2 - 100;
          progY = hImage/2 - 10;

          divcan.setAttribute("style",divcanStyle+nosel+"height:"+hImage+"px;width:"+wImage+"px;");
        }
        if (numHoverzones > 0 && !gotHoverzones) {
          hoverCan.height = drwCan.height;
          hoverCan.width = drwCan.width;
          ctxh = hoverCan.getContext("2d");
          ctxh.clearRect(0,0, hoverCan.width, hoverCan.height);
          for (var l=0; l<hoverzones.length; l++) {
            var hz = hoverzones[l].ctx.getImageData(0,0,
               hoverzones[l].width, hoverzones[l].height).data;
            var tar = ctxh.getImageData(
               hoverzones[l].xmin, hoverzones[l].ymin,
               hoverzones[l].width, hoverzones[l].height);
            for (var m=3; m<hz.length; m+=4) {
              if (hz[m] != 0) {
                tar.data[m] = (l+1);
              }
            }
            ctxh.putImageData(tar, hoverzones[l].xmin, hoverzones[l].ymin);
          }
          if (!enableZooming) doHoverzones = true;
          gotHoverzones = true;
        }

        if (fetchImages) {
          fetchImages = false;
          ctx = imgCan.getContext("2d");
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle="blue";
          ctx.font="bold 20px Arial";
          ctxd = drwCan.getContext("2d");
          ctxd.imageSmoothingEnabled = false;
          toggleFrames = new Array(numFrames);
          if (useToggle) makeToggles(numFrames);

          if (numOverlays > 0) {
            overlayImages = new Array(numFrames);
            for (k=0; k<numFrames; k++) {
              overlayImages[k] = new Array(numOverlays)
              for (j=0; j<numOverlays; j++) {
                overlayImages[k][j] = new Image();
                overlayImages[k][j].gotit = false;
                overlayImages[k][j].frameNum = k;
                overlayImages[k][j].overlayNum = j;
                overlayImages[k][j].onerror = function() {
                  imgGotCount++;
                }
                overlayImages[k][j].onload = function() {
                  this.gotit = true;

                  imgGotCount++;
                  drawProgress();
                  if (this.height != imgCan.height || this.width != imgCan.width) {
                    this.gotit = false;
                    info("Bad image size:"+this.src);
                  }

                  if (isOverlayEnh && this.gotit && this.overlayNum == overlayEnhNum) {
                    var f = this.frameNum;
                    origCan[f].height = this.height;
                    origCan[f].width = this.width;
                    ctxo = origCan[f].getContext("2d");
                    ctxo.drawImage(this, 0, 0);
                    origIDd[f] = ctxo.getImageData(0,0,this.width,this.height).data;

                    enhCan[f].height = this.height;
                    enhCan[f].width = this.width;
                    ctxe[f] = enhCan[f].getContext("2d");
                    ctxe[f].drawImage(this, 0, 0)
                    enhID[f] = ctxe[f].getImageData(0,0,this.width,this.height);

                    overlayImages[f][this.overlayNum] = null;
                    overlayImages[f][this.overlayNum] = enhCan[f];
                    overlayImages[f][this.overlayNum].gotit = true;
                  }
                }

                var ofn = overlayFiles[k][j];
                if (overlayStatic != undefined && !overlayStatic[j]) {
                  ofn = overlayFiles[k][j]+olayNotStatic;
                }
                overlayImages[k][j].src = ofn;
                imgCount++;
              }
            }
          }

          if (hiResBaseName != null) {
            hiResBase = new Array();
            for (j=0; j<hiResBaseName.length; j++) {
              hiResBase[j] = new Image();
              hiResBase[j].gotit = false;
              hiResBase[j].onerror = function(e) {
                imgGotCount++;
              }
              hiResBase[j].onload = function(e) {
                e.currentTarget.gotit = true;
                imgGotCount++;
                drawProgress();
              }

              hiResBase[j].src = hiResBaseName[j];
              imgCount++;
            }
          }

          if (hiResOlayName != null) {
            hiResOlay = new Array();
            for (j=0; j<hiResBaseName.length; j++) {
              hiResOlay[j] = new Image();
              hiResOlay[j].gotit = false;
              hiResOlay[j].onerror = function(e) {
                imgGotCount++;
              }
              hiResOlay[j].onload = function(e) {
                e.currentTarget.gotit = true;
                imgGotCount++;
                drawProgress();
              }

              hiResOlay[j].src = hiResOlayName[j];
              imgCount++;
            }
          }

        }

        if (this.height == imgCan.height && this.width == imgCan.width) {
          this.gotit = true;
        } else {
          this.gotit = false;
          info("Image has invalid size:"+this.src);
        }


        if (isBaseEnh && this.gotit) {
          var f = this.frameNum;
          origCan[f].height = this.height;
          origCan[f].width = this.width;
          ctxo = origCan[f].getContext("2d");
          ctxo.drawImage(this, 0, 0);
          origIDd[f] = ctxo.getImageData(0,0,this.width, this.height).data;

          enhCan[f].height = this.height;
          enhCan[f].width = this.width;
          ctxe[f] = enhCan[f].getContext("2d");
          ctxe[f].drawImage(this, 0, 0)
          enhID[f] = ctxe[f].getImageData(0,0,this.width, this.height);

          backImages[f] = null;
          backImages[f] = enhCan[f];
          backImages[f].gotit = true;
        }

        imgGotCount++;
        drawProgress();

        if (!isRunning) {
          isRunning = true;
          setIsLooping(true);
          //HAniS.run();
          run();
        }

        isLooping = wasLooping;
        if (!keepZoom) HAniS.resetZoom();
        gotImages = true;
      }

      var bfn = backFiles[i];
      if (!backStatic) bfn = backFiles[i]+olayNotStatic;
      backImages[i].src = bfn;
      imgCount++;

    }


    showTip = false;
    showDistance = false;
    drawLines();
  }

  var configButton = function(button, name, defOn, defOff, tip) {
    button.label_on = defOn;
    button.label_off = defOff;
    var wid = null;
    var lab = configValues[name+"_labels"];
    if (lab == null) lab = configValues[name+"_label"];
    if (lab != null) {
      var ssl = lab.split(",");
      button.label_on = ssl[0].trim();
      if (ssl.length > 1) button.label_off = ssl[1].trim();
      if (ssl.length > 2) wid = "width:"+ssl[2].trim()+"px;"
    }

    if (tip != null) button.title = tip;

    button.innerHTML = button.label_on;
    var sty = (wid!=null?wid:"")+buttcss+configValues[name+"_style"];
    if (sty != null) button.setAttribute("style", sty);
  }

  var doMakeControls = function(control, isTop) { 

    var i,k, tips;
    var divcon = make("div");
    divcon.align="center";
    divcon.setAttribute("style","position:relative;padding:2px;width:100%;");
    buttcss = configValues["buttons_style"];
    var tooltips = null, wid = null, sty = null;

    if (isTop) {
      if (configValues["controls_style"] != null) {
        divcon.setAttribute("style",configValues["controls_style"]);
      }
      tooltips = configValues["controls_tooltip"];
      divall.insertBefore(divcon, divcan); 
    } else {
      if (configValues["bottom_controls_style"] != null) {
        divcon.setAttribute("style",configValues["bottom_controls_style"]);
      } else if (configValues["controls_style"] != null) {
        divcon.setAttribute("style",configValues["controls_style"]);
      }
      tooltips = configValues["bottom_controls_tooltip"];
      divall.appendChild(divcon); 
    }
    if (tooltips != null) {
      tips = tooltips.split(",");
    }

    var c = control.split(",");
    var divolay = null, ssl;
    var mytip;
    for (i=0; i<c.length; i++) {
      if (tooltips != null) {
        mytip = tips[i];
      } else {
        mytip = null;
      }

      var enhfile = configValues["enhance_filename"];
      if (enhfile == null) enhfile = configValues["enhance_table"];
      if (c[i].trim() == "enhance" && enhfile != null) {
        enhance = make("select");
        sty = configValues["enhance_style"];
        if (sty != null) enhance.setAttribute("style", sty);
        if (mytip != null) enhance.title = mytip;
        var opt = make("option");
        opt.innerHTML = "Pick Enhancement";
        opt.value = -1;
        enhance.add(opt);
        enhance.addEventListener("change",HAniS.doEnhance,false);
        isBaseEnh = !isOverlayEnh;
        if (isBaseEnh) {
          enhance.disabled = false;
        } else {
          enhance.disabled = true;
        }
        divcon.appendChild(enhance);
        gotEnhTable = false;

        var reqet = new XMLHttpRequest();
        tabVal = new Array();
        tabUnit = new Array();
        tabPrefix = new Array();
        tabDecimal = new Array();
        var tabPrevUnit, tabPrevPrefix, tabPrevDecimal;
        tabR = new Array();
        tabG = new Array();
        tabB = new Array();
        tabA = new Array();
        tabNum = -1;
        var gotValues = false;

        var inlo, inhi, indif, rlo, rhi, glo, ghi, blo, bhi, vlo, vhi, alo, ahi;

        reqet.onload = function() {
          var txt = this.responseText.split("\n");
          for (var i=0; i<txt.length; i++) {
            if (txt[i].length < 2) continue;

            var sr = txt[i].replace(/\s+/g,' ').trim();
            var m = sr.indexOf("#");
            if (m == 0) continue;
            if (m > 0) sr = sr.substring(0,m);

            if (sr.indexOf("*") == 0) {
              tabNum++;
              tabVal[tabNum] = new Array(256);
              tabPrefix[tabNum] = new Array(256);
              tabUnit[tabNum] = new Array(256);
              tabDecimal[tabNum] = new Array(256);
              tabR[tabNum] = new Array(256);
              tabG[tabNum] = new Array(256);
              tabB[tabNum] = new Array(256);
              tabA[tabNum] = new Array(256);
              tabVal[tabNum] = new Array(256);
              tabPrevUnit = " ";
              tabPrevPrefix = "Value =";
              tabPrevDecimal = 1;

              var opt = make("option");
              opt.innerHTML = sr.substring(1);
              opt.value = tabNum;
              enhance.add(opt);
              
            } else {

              var valInx = sr.indexOf("value");
              if (valInx < 0) valInx = sr.indexOf("probe");
              gotValues = false;
              vlo = vhi = 0;
              if (valInx > 0) {
                var valString = sr.substring(valInx+1);
                sr = sr.substring(0,valInx);
                var valEq = valString.indexOf("=");
                valString = valString.substring(valEq+1);
                var valItems = valString.split(",");
                if (valItems.length == 1) {
                  tabPrevPrefix = valItems[0].trim();
                  tabPrevDecimal = -1;
                  gotValues = false;
                } else {
                  vlo = parseFloat(valItems[0].trim());
                  vhi = parseFloat(valItems[1].trim());
                  if (valItems.length > 2) {
                    tabPrevDecimal = parseInt(valItems[2],10);
                  }
                  if (valItems.length > 3) {
                    tabPrevUnit = valItems[3].trim();
                  }
                  if (valItems.length > 4) {
                    tabPrevPrefix = valItems[4].trim();
                  }

                  gotValues = true;
                }
              }

              var sp = sr.split(" ");
              inlo = parseInt(sp[0].trim(), 10);
              inhi = parseInt(sp[1].trim(), 10);
              indif = inhi - inlo;
              rlo = parseFloat(sp[2].trim());
              rhi = parseFloat(sp[3].trim());
              glo = parseFloat(sp[4].trim());
              ghi = parseFloat(sp[5].trim());
              blo = parseFloat(sp[6].trim());
              bhi = parseFloat(sp[7].trim());
              alo = ahi = 255;
              if (sp.length > 9) {
                alo = parseFloat(sp[8].trim());
                ahi = parseFloat(sp[9].trim());
              }

              for (var k=inlo; k<=inhi; k++) {
                if (indif == 0) {
                  tabR[tabNum][inlo] = rlo;
                  tabG[tabNum][inlo] = glo;
                  tabB[tabNum][inlo] = blo;
                  tabA[tabNum][inlo] = alo;
                } else {
                  tabR[tabNum][k] = Math.round(rlo + (rhi - rlo) * (k - inlo) / indif);
                  tabG[tabNum][k] = Math.round(glo + (ghi - glo) * (k - inlo) / indif);
                  tabB[tabNum][k] = Math.round(blo + (bhi - blo) * (k - inlo) / indif);
                  tabA[tabNum][k] = Math.round(alo + (ahi - alo) * (k - inlo) / indif);
                }
                tabPrefix[tabNum][k] = tabPrevPrefix;
                tabUnit[tabNum][k] = tabPrevUnit;
                tabDecimal[tabNum][k] = tabPrevDecimal;
                if (gotValues) {
                  tabVal[tabNum][k] = vlo + (vhi - vlo) * (k - inlo) / indif;
                }
              }
            }
          }

          gotEnhTable = true;
        }

        reqet.open("get",enhfile,true);
        reqet.send();
      }

      if (c[i].trim() == "startstop") {
        startstop = make("button");
        configButton(startstop, "startstop", "Start", "Stop", mytip);
        startstop.addEventListener("click",HAniS.toggleIsLooping,false);
        divcon.appendChild(startstop);
      }

      if (c[i].trim() == "looprock") {
        looprock = make("button");
        configButton(looprock, "looprock", "Rock", "Loop", mytip);
        direction = 1;
        looprock.addEventListener("click",HAniS.toggleLoopRock,false);
        divcon.appendChild(looprock);
      }

      if (c[i].trim() == "extrap") {
        extrap = make("button");
        configButton(extrap, "extrap", "Enable Extrap", "Disable Extrap", mytip);
        extrap.addEventListener("click",HAniS.toggleExtrap,false);
        divcon.appendChild(extrap);
      }

      if (c[i].trim() == "distance") {
        distance = make("button");
        configButton(distance, "distance", "Show dist", "Hide dist", mytip);

        distShift = false;
        doDistance = false;

        distance.addEventListener("click", function() {
          doDistance = !doDistance;
          if (doDistance) {
            distance.innerHTML = distance.label_off;
          } else {
            distance.innerHTML = distance.label_on;
          }
        }, false);
        divcon.appendChild(distance);
      }

      if (c[i].trim() == "probe") {
        probe = make("button");
        configButton(probe, "probe", "Show probe", "Hide probe", mytip);

        doProbe = false;
        showProbe = false;

        probe.addEventListener("click", function() {
          doProbe = !doProbe;
          if (doProbe) {
            probe.innerHTML = probe.label_off;
            showProbe = true;
          } else {
            probe.innerHTML = probe.label_on;
            showProbe = false;
          }
        }, false);
        divcon.appendChild(probe);
      }


      if (c[i].trim() == "refresh") {
        refresh = make("button");
        configButton(refresh, "refresh", "Refresh", null, mytip);

        refresh.addEventListener("click",HAniS.reloadFOF,false);
        divcon.appendChild(refresh);
      }

      if (c[i].trim() == "setframe" ) {
        setframe= make("input");
        setframe.type = "range";
        setframe.min = 0;
        setframe.max = 99;
        setframe.value=0;
        setframeLabel = "Frame #*";
        if (configValues["setframe_label"] != null) {
          setframeLabel = configValues["setframe_label"];
        }

        setframeLabelSpan = make("span");
        setframeLabelSpan.innerHTML = setframeLabel.replace("*",1);

        sty ="display:block;vertical-align:middle;"+configValues["setframe_style"];
        setframe.setAttribute("style", sty);

        var dsf = make("span");
        dsf.setAttribute("style","display:inline-block;vertical-align:top;");
        setframeLabelSpan.setAttribute("style","display:block;vertical-align:middle;"+configValues["setframe_label_style"]);
        dsf.appendChild(setframeLabelSpan);
        dsf.appendChild(setframe);
        
        divcon.appendChild(dsf);
        setframe.addEventListener("input", function(e) {
          setIsLooping(false); 
          setCurrentFrame(parseInt(setframe.value, 10));
          setframeLabelSpan.innerHTML = setframeLabel.replace("*",(curFrame+1));
          drawIt();
        }, false);
        isSetframe = true;
      }

      if (c[i].trim() == "framelabel" ) {
        frameLabelField = make("button");
        frameLabelField.innerHTML = "";
        frameLabels = null;
        if (configValues["frame_labels"] != null) {
          frameLabels = configValues["frame_labels"].split(",");
          frameLabelField.innerHTML = frameLabels[0];
        }
        sty = buttcss+configValues["framelabel_style"];
        if (sty != null) frameLabelField.setAttribute("style", sty);
        divcon.appendChild(frameLabelField);
      }

      if (c[i].trim() == "autorefresh" || c[i].trim() == 'autorefresh/off') {
        if (refreshTimer != null) clearInterval(refreshTimer);
        autotoggle = make("button");
        configButton(autotoggle, "autorefresh","Disable Auto Refresh","Enable Auto Refresh", mytip);
        autotoggle.addEventListener("click",HAniS.toggleAutoRefresh,false);
        isAutoRefresh = false;
        divcon.appendChild(autotoggle);
        if (c[i].trim() == "autorefresh") {
          HAniS.toggleAutoRefresh();
        } else {
          autotoggle.innerHTML = autotoggle.label_off;
        }
      }

      if (c[i].trim() == "step") {
        var sl = configValues["step_labels"];
        var sl2 = (sl != null) ? sl.split(",") : ["<", ">"]; 
        backward = make("button");
        backward.innerHTML = sl2[0];
        backward.addEventListener("click",function() {
          setIsLooping(false); 
          incCurrentFrame(-1);
          drawIt();
        }, false);

        sty = buttcss+configValues["step_style"];
        if (sty != null) backward.setAttribute("style", sty);
        if (tooltips != null) backward.title = tips[i].trim();
        divcon.appendChild(backward);

        forward = make("button");
        forward.innerHTML = sl2[1];
        forward.addEventListener("click",function() {
          setIsLooping(false); 
          incCurrentFrame(+1);
          drawIt();
        }, false);

        if (sty != null) forward.setAttribute("style", sty);
        if (tooltips != null) forward.title = tips[i].trim();
        divcon.appendChild(forward);
      }

      if (c[i].trim() == "firstlast") {
        var sl = configValues["firstlast_labels"];
        var sl2 = (sl != null) ? sl.split(",") : ["<<", ">>"]; 
        first = make("button");
        first.innerHTML = sl2[0];
        first.addEventListener("click",function() {
          setIsLooping(false); 
          setCurrentFrame(0);
          drawIt();
        }, false);

        sty = buttcss+configValues["firstlast_style"];
        if (sty != null) first.setAttribute("style", sty);
        if (tooltips != null) first.title = tips[i].trim();
        divcon.appendChild(first);

        last = make("button");
        last.innerHTML = sl2[1];
        last.addEventListener("click",function() {
          setIsLooping(false); 
          setCurrentFrame(numFrames - 1);
          drawIt();
        }, false);

        if (sty != null) last.setAttribute("style", sty);
        if (tooltips != null) last.title = tips[i].trim();
        divcon.appendChild(last);
      }

      if (c[i].trim() == "setspeed") {
        setSpeed = make("input");
        setSpeed.type = "range";
        setSpeed.min = minDwell;
        setSpeed.max = maxDwell; 
        setSpeed.value = maxDwell - dwell;
        if (tooltips != null) setSpeed.title = tips[i].trim();
        sty ="vertical-align:middle;"+configValues["setspeed_style"];
        setSpeed.setAttribute("style", sty);
        setSpeed.addEventListener("input", function(e) {
          dwell = maxDwell - parseInt(setSpeed.value,10) + 30;
          setIsLooping(true);
          drawIt();
        }, false);
        divcon.appendChild(setSpeed);


      } else if (c[i].trim() == "speed") {
        var sl = configValues["speed_labels"];
        var sl2 = (sl != null) ? sl.split(",") : ["-","+"];
        slower = make("button");
        slower.innerHTML = sl2[0];
        slower.addEventListener("click",function() {
          dwell = dwell + stepDwell;
          faster.disabled = false;
          if (dwell > maxDwell) {
            dwell = maxDwell;
            slower.disabled = true;
          }
        }, false);

        sty = buttcss+configValues["speed_style"];
        if (sty != null) slower.setAttribute("style", sty);
        if (tooltips != null) slower.title = tips[i].trim();
        divcon.appendChild(slower);

        faster = make("button");
        faster.innerHTML = sl2[1];
        faster.addEventListener("click",function() {
          dwell = dwell - stepDwell;
          slower.disabled = false;
          if (dwell < minDwell) {
            dwell = minDwell;
            faster.disabled = true;
          }   
        }, false);
        if (sty != null) faster.setAttribute("style", sty);
        if (tooltips != null) faster.title = tips[i].trim();
        divcon.appendChild(faster);
      }

      if (c[i].trim() == "zoom") {
        zoom = make("button");
        configButton(zoom, "zoom", "Zoom", "Un-zoom", mytip);
        zoom.addEventListener("click",HAniS.toggleZooming,false);
        divcon.appendChild(zoom);
      }

      if(c[i].trim() == "toggle" ) {
        toggleFrames = new Array();
        var togs = configValues["toggle_size"];
        if (togs != null) {
          var togv = togs.split(",");
          wTog = parseInt(togv[0],10);
          hTog = parseInt(togv[1],10);
          spTog = parseInt(togv[2],10);
        } else {
          wTog = 10;
          hTog = 10;
          spTog = 3;
        }
        divtog = make("div");
        divtog.setAttribute("style",nosel);
        divtog.style.backgroundColor = divcon.style.backgroundColor;
        divtog.align="center";
        togPointer = new PEvs(divtog, null, null, null, null, HAniS.togclick, null);
        cantog = make("canvas");
        cantog.height = 2*hTog;
        ctxtog = cantog.getContext("2d");
        divtog.appendChild(cantog);
        if (isTop) {
          divall.insertBefore(divtog, divcan); 
        } else {
          divall.appendChild(divtog); 
        }
        useToggle = true;

        if (tooltips != null) divtog.title = tips[i].trim();

      }


      if (c[i].trim() == "overlay") {

        overlayCheck = new Array();
        var olt = configValues["overlay_tooltip"];
        var oltips = null;
        if (olt != null) oltips = olt.split(",");
        var olr = configValues["overlay_radio"];
        var olrad = null;
        if (olr != null) {
          olrad = olr.split(",");
        }

        var olc = configValues["overlay_labels_color"];
        var olcolor = null;
        if (olc !=null) {
          olcolor = olc.split(",");
        }

        overlayStatic = new Array();
        var ols = configValues["overlay_caching"];
        var olstat = null;
        if (ols == null) ols = configValues["overlay_static"];
        if (ols != null) olstat = ols.split(",");

        for (k=0; k<overlayLabels.length; k++) {
          var olab = overlayLabels[k].trim();

          if (k == 0 || olab.indexOf("/") == 0) {
            if (olab.indexOf("/") == 0) olab = olab.substr(1);
            divolay = make("div");
            divolay.align="center";
            if (isTop) {
              divall.insertBefore(divolay, divcan); 
            } else {
              divall.appendChild(divolay); 
            }
            if (configValues["overlay_labels_style"] != null) {
              divolay.setAttribute("style",configValues["overlay_labels_style"]);
            }
          }

          var olon = false;
          var oll = olab.length;
          if (olab.indexOf("/on") > 0 && olab.indexOf("/on") == oll-3) {
            olon =true;
            olab = olab.substr(0,oll-3);
          }

          var isAlways = false;
          if (olab.indexOf("/always")> 0 && olab.indexOf("/always")  == oll-7) {
            olon = true;
            isAlways = true;
          } 

          var isHidden = false;
          if (olab.indexOf("/hidden") > 0 && olab.indexOf("/hidden") == oll-7) {
            isHidden = true;
          }

          if (olstat != null) {
            if (olstat[k].trim().toLowerCase() == "y" ||
                olstat[k].trim().toLowerCase() == "t") {
            overlayStatic[k] = true;
            } else {
              overlayStatic[k] = false;
            }
          } else {
            overlayStatic[k] = true;
          }


          overlayCheck[k] = make("input");
          overlayCheck[k].type = "checkbox";
          overlayCheck[k].value = olab;
          if (configValues["checkbox_style"] != null) {
            overlayCheck[k].setAttribute("style",
                             configValues["checkbox_style"]);
          }
          overlayCheck[k].checked = olon;
          if (enhance != null) {
            if ((k == overlayEnhNum) && overlayCheck[k].checked) {
              enhance.disabled = false;
            }
          }

          if (allowHoverzones != null && (!allowHoverzones[k] && olon)) okToShowHoverzones = false;
          overlayCheck[k].addEventListener("click",HAniS.overClick,false);
          if (olr != null) {
            if (olrad[k].indexOf("true") != -1) {
              overlayCheck[k].type="radio";
              var grp = olrad[k].indexOf("/");
              if (grp != -1) {
                overlayCheck[k].name = olrad[k].substr(grp+1).trim();
              } else {
                overlayCheck[k].name="all";
              }
            }
            
          }

          if (!isAlways && !isHidden) {
            if (oltips != null) overlayCheck[k].title = oltips[k];
            var lab = make('label');
            lab.htmlFor = olab;
            //lab.innerHTML=olab;
            if (oltips != null) lab.title = oltips[k];
            lab.appendChild(document.createTextNode(olab));
            var lsty = "vertical-align:top;";
            if (olcolor != null) {
              lsty = lsty + "color:"+olcolor[k]+";";
            }

            lab.setAttribute("style",lsty);
            var spn = make("span");
            var space = "10"
            if (overlaySpacer != null) {
              space = 10 + overlaySpacer[k];
            }
            spn.setAttribute("style","margin-left:"+space+"px;");
            spn.appendChild(overlayCheck[k]);
            spn.appendChild(lab);
            divolay.appendChild(spn);
          }
        }


        // now fix up links, if there
        if (overlayLinks == null) {
          overlayLinks = new Array(overlayLabels.length);
          for (k=0; k<overlayLabels.length; k++) {
            overlayLinks[k] = 0;
          }

        } else {
          for (k=0; k<overlayLabels.length; k++) {
            resetLinks(k);
          }
        }
      }
    }
  }

  var resetLinks = function(i) {
    var k,state;
    
    if (overlayLinks[i] < 0) {
      state = false;
      for (k=0; k<overlayLabels.length; k++) {
        if (overlayLinks[k] == -overlayLinks[i]) {
          if (!state) state = overlayCheck[k].checked;
        }
      }
      overlayCheck[i].checked = state;
    }
  }


  var fetchHotspot = function(st) {

    var hro, hro2;
    if (numHotspots == 0) hotspots = new Array();
    hro = st.split("=");
    hro2 = hro[1].split(",");
    // hotspot=x,y,w,h,pan/olay#,action,value [,tip]
    // x,y,w,h,pan,action,value,overlay
    var pan = hro2[4].trim();
    var ps = hro2[4].indexOf("/");
    var polay = -1;
    if (ps != -1) {
      polay = parseInt(hro2[4].substring(ps+1), 10)-1;
      pan = pan.substring(0,ps);
    }

    hotspots[numHotspots] = new Hotspot(
      parseInt(hro2[0].trim(),10),
      parseInt(hro2[1].trim(),10),
      hro2[2].trim(), hro2[3].trim(),
      pan.toLowerCase(),
      hro2[5].trim().toLowerCase(),
      hro2[6].trim(), polay, 
      (hro2.length == 8 ? hro2[7].trim() : null) 
    );

    numHotspots = numHotspots + 1;
  }

  var fetchHoverzone = function(st) {
    // Hoverzone = color, action, value, tip, poly
    // Hoverzone = 0xfe00fe, fof, temp/fof.txt, Click me, (100, 200, 110, ...)
    var hro, hro2;
    if (numHoverzones == 0) {
      hoverzones = new Array();
      hoverInx = -1;
    }
    hro = st.split("=");
    var hroq = hro[1].split("(");
    hro2 = hroq[0].split(",");
    var col = hro2[0].trim();
    if (col.indexOf("0x") == 0) {
      col = "#"+col.substring(2);
    }


    hoverzones[numHoverzones] = new Hoverzone(
        col, hro2[1].trim(), 
        hro2[2].trim(), hro2[3].trim(),hroq[1].trim()
    );
    numHoverzones = numHoverzones + 1;
  }
  
  var fetchHotzone = function(st) {
    var hro, hro2;
    if (numHotzones == 0) hotzones = new Array();
    hro = st.split("=");
    hro2 = hro[1].split(",");
    // hotzone = olay#, color, action, value [,tip]
    hotzones[numHotzones] = new Hotzone(
        parseInt(hro2[0],10)-1,
        parseInt(hro2[1],16),
        hro2[2].trim(), hro2[3].trim(), 
        (hro2.length == 5 ? hro2[4].trim():"Click for details")
    );
    numHotzones = numHotzones + 1;
  }

  /** @constructor */
  function Hoverzone(color, action, value, tip, poly) {
    this.color = color;
    this.alpha = 1.0
    if (this.color.length > 7) {
      this.alpha = parseInt(this.color.substring(7),16) / 255.;
      this.color = this.color.substring(0,7);
      if (this.alpha < .1) this.alpha = .1;
    }
    this.action = action;
    this.value = value;
    this.tip = tip;
    this.poly = poly;
    var xyc = poly.split(",");
    this.xy = [];
    this.xmin = 9999;
    this.ymin = 9999;
    this.xmax = 0;
    this.ymax = 0
    for (var i=0; i<xyc.length; i++) {
      this.xy[i] = parseInt(xyc[i].trim(), 10)
      if (i % 2 == 0) {
        if (this.xy[i] < this.xmin) this.xmin = this.xy[i];
        if (this.xy[i] > this.xmax) this.xmax = this.xy[i];
      } else {
        if (this.xy[i] < this.ymin) this.ymin = this.xy[i];
        if (this.xy[i] > this.ymax) this.ymax = this.xy[i];
      }
    }
    this.height = this.ymax - this.ymin + 1;
    this.width = this.xmax - this.xmin + 1;

    this.can = make("canvas");
    this.can.height = this.height;
    this.can.width = this.width;
    this.ctx = this.can.getContext("2d");
    this.ctx.imageSmoothingEnabled=false;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = this.alpha;

    this.ctx.beginPath();
    this.ctx.moveTo(this.xy[0]-this.xmin, this.xy[1]-this.ymin);
    for (var i=2; i<this.xy.length; i=i+2) {
      this.ctx.lineTo(this.xy[i]-this.xmin, this.xy[i+1]-this.ymin);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  /** @constructor */
  function Hotzone(overlay, color, action, value, tip) {
    this.overlay = overlay;
    this.color = color;
    this.action = action;
    this.value = value;
    this.tip = tip;
  }


  /** @constructor */
  function Hotspot(x, y, w, h, pan, action, value, overlay, tip) {
    this.x0= x;
    this.y0= y;
    this.icon = null;
    if (w == "icon") {
      this.icon = new Image();
      this.icon.hotspot = this;
      isIconHotspot = true;
      this.icon.onload = function(eimg) {
        this.gotit = true;
        this.hotspot.x1 = this.hotspot.x0+this.width;
        this.hotspot.y1 = this.hotspot.y0+this.height;
      }

      this.icon.gotit = false;
      this.icon.src = h.trim();
      this.x1 = -1;
      this.y1 = -1;

    } else {
      this.x1 = parseInt(w,10)+x;
      this.y1 = parseInt(h,10)+y;
    }

    this.pan = pan;
    this.action = action;
    this.value = value;
    this.overlay = overlay;
    this.tip = tip;
  }

  this.drag = function(e) {

    xScreen = pointer.getX();
    yScreen = pointer.getY();

    showTip = false;

    showDistance = false;

    if (doDistance && ( !distShift || (distShift && e.shiftKey) ) ) {
      x1Dist = xScreen;
      y1Dist = yScreen;
      showDistance = true;
      drawLines();
      return;
    }

    if (enableZooming && (zoomYFactor != zoomYBase)) {

      xMove = Math.round(xImage*zoomXFactor - xScreen)/zoomXFactor;
      yMove = Math.round(yImage*zoomYFactor - yScreen)/zoomYFactor;

      if (xMove < 0) xMove = 0;
      if (yMove < hideTop) yMove = hideTop;
      if (xMove + wImage > imgCan.width) xMove = imgCan.width - wImage;
      if (yMove + hImage > (imgCan.height-hideBottom)) yMove = imgCan.height - hideBottom- hImage;
      xImage = Math.round(xMove + xScreen/zoomXFactor);
      yImage = Math.round(yMove + yScreen/zoomYFactor);

    } else if (!isExtrap && doHoverzones) {
      hoverInx = -1;
      if (okToShowHoverzones) {
        if (xScreen >= 0 && yScreen >= 0) {
          rgb = ctxh.getImageData(xScreen,yScreen,1,1).data;
          if (rgb[3] != 0) {
            hoverInx = rgb[3] - 1 ;
          }
        }
      }
    }

    isDragging = true;
    drawIt();
    drawLines();
  }

  var setHiResZoomIndex = function() {
    if (!doingHiResZoom) return;
    hiResZoomIndex = -1;
    for (var i=0; i<hiResZoomLevel.length; i++) {
      if (zoomXFactor >= hiResZoomLevel[i]) {
        hiResZoomIndex = i;
      }
    }
  }

  var doAction = function(item, type) {
    if (item.action == "popup") {
      if (popupWindow != null) popupWindow.close();
        popupWindow =
        window.open("","HAniSPopup","scrollbars=yes,width="+popupWinWidth+",height="+popupWinHeight);
        popupWindow.document.write(popupDiv+item.value+"</div>");
        
      } else if (item.action == "link") {
        window.open(item.value,"_blank","");

      } else if (item.action == "fof") {
        imageBase = configImageBase;
        HAniS.resetZoom();
        HAniS.newFOF(item.value);
        clearOverlays(type);
      }
  }

  this.resetZoom = function() {

    zoomXFactor = zoomXBase;
    zoomYFactor = zoomYBase;

    if (zoom != null) {
      zoom.innerHTML = zoom.label_on;
      enableZooming = false;
    }

    xImage = xScreen;
    yImage = yScreen;
    xMove = 0;
    yMove = 0;
    hImage = imgCan.height;
    wImage = imgCan.width;
    setHiResZoomIndex();
    drawIt();

    if (gotHoverzones) {
      doHoverzones = true;
    }
  }

  this.canTip = function() {
    var i;
    showTip = false;
    xScreen = pointer.getX();
    yScreen = pointer.getY();

    if (isExtrap && yScreen < extrapHbeg && xScreen > extrapXbeg) {
      return;
    }

    xImage = Math.round(xMove + xScreen/zoomXFactor);
    yImage = Math.round(yMove + yScreen/zoomYFactor);

    if (numHotzones != 0) {
      for (i=0; i<numHotzones; i++) {
        if (hotzones[i].overlay >= numOverlays ) {
          info(" Error...hotzone overlay # "+hotzones[i].overlay+" > number of overlays = "+numOverlays);
          continue;
        }
        
        if (overlayCheck[hotzones[i].overlay].checked) {
          ctx1.clearRect(0,0,1,1);
          ctx1.drawImage(overlayImages[curFrame][hotzones[i].overlay],Math.floor(xImage),Math.floor(yImage),1,1,0,0,1,1);
          rgb = ctx1.getImageData(0,0,1,1).data;
          rgbpack = (rgb[0]<<16) + (rgb[1]<<8) + rgb[2];

          if (rgbpack == hotzones[i].color) {
            showTip = true;
            tipX = xScreen;
            tipY = yScreen;
            tipText = hotzones[i].tip;
            break;
          }
        }
      }
    }

    if (numHotspots != 0) {
      for (i=0; i<numHotspots; i++) {
        if (hotspots[i].overlay != -1 &&
               !overlayCheck[hotspots[i].overlay].checked) continue; 

        if (xScreen > hotspots[i].x0 && xScreen < hotspots[i].x1 &&
            yScreen > hotspots[i].y0 && yScreen < hotspots[i].y1) {

           if (hotspots[i].tip != null) {
             showTip = true;
             tipX = xScreen;
             tipY = yScreen;
             tipText = hotspots[i].tip;
             break;
           }
        }
      }
    }
    drawLines();
  }

  this.move = function() {
    if (!isExtrap && doHoverzones) {
      hoverInx = -1;
      if (okToShowHoverzones) {
        var x = pointer.getX();
        var y = pointer.getY();
        if (x >= 0 && y >= 0) {
          rgb = ctxh.getImageData(x,y,1,1).data;
          if (rgb[3] != 0) {
            hoverInx = rgb[3] - 1 ;
          }
        }
      }
    }
    if (isExtrap && extrapMode >= 2) {
      xScreen = pointer.getX();
      yScreen = pointer.getY();
    }
    drawLines();
  }


  this.down = function() {
    if (showTip) {
      showTip = false;
      drawLines();
    }

    xScreen = pointer.getX();
    yScreen = pointer.getY();
    x0Dist = xScreen;
    y0Dist = yScreen;
    x1Dist = x0Dist;
    y1Dist = y0Dist;
    xImage = Math.round(xMove + xScreen/zoomXFactor);
    yImage = Math.round(yMove + yScreen/zoomYFactor);
    isDragging = false;
    isDown = true;
  }

  this.up = function(e) {
    showTip = false;
    isDown = false;

    if (isExtrap) {
      xScreen = pointer.getX();
      yScreen = pointer.getY();

      if (extrapMode < 3) {
        extrapX[extrapMode] = xScreen;
        extrapY[extrapMode] = yScreen;
        extrapT[extrapMode] = minutes[curFrame];
        if (extrapMode == 0) {
          extrapMode = 1;
          setCurrentFrame(numFrames - 1);
          exMsg = 1;
          dirspdLabel = null;

        } else {
          dt = extrapT[1] - extrapT[0];
          dxdt = (extrapX[1] - extrapX[0]) / dt;
          dydt = (extrapY[1] - extrapY[0]) / dt;

          if (dirspdBox != null && distXScale != null) {
            var ddx = dxdt * distXScale;
            var ddy = dydt * distYScale;
            var speed = Math.round(Math.sqrt(ddx*ddx + ddy*ddy) * 60.);
            var dir = Math.atan2(ddx, -ddy)/.0174533;
            if (dir < 0.0) dir = dir + 360.;
            dirspdLabel = dirspdPrefix+compass[Math.round(dir/22.5)]+" at "+speed+" "+dirspdSuffix;

            dirspdX = extrapX[0];
            dirspdY = (dydt > 0) ? extrapY[0] - 15 : extrapY[0] + 30;
          }


          var timeFontSize = parseInt(timeFont,10);

          nmin= Math.round(Math.abs((timeFontSize+4)*4/dxdt));  // ap rox 14pt x 4 digits
          tmin= Math.round(Math.abs((timeFontSize+4)*2/dydt));  // ap rox 14pt x 2 height
          if (tmin < nmin) nmin = tmin;

          if (nmin > 120) {
            nmin = 120*Math.floor(nmin/120)+60;
          } else if (nmin > 90) {
            nmin = 120;
          } else if (nmin > 60) {
            nmin = 90;
          } else if (nmin > 30) {
            nmin = 60;
          } else if (nmin > 15) {
            nmin = 30;
          } else if (nmin > 10) {
            nmin = 15;
          } else if (nmin > 5) {
            nmin = 10;
          } else if (nmin > 2) {
            nmin = 5;
          } else {
            if (nmin == 0) nmin = 1;
          }

          tmin = (extrapT[1]/nmin*nmin) + nmin;

          exsign = 1;
          if (toFrom) exsign = -1;
          xInc = dxdt * nmin;
          yInc = dydt * nmin;

          setCurrentFrame(numFrames - 1);
          extrapMode = 3; 
          exMsg = 2;
        }

      } else if (yScreen < extrapHbeg && xScreen > extrapXbeg) {

        if (extrapMode == 3) {
          initExtrap();
          drawLines();
          return;
        }

      }
      drawLines();

    }

    if (showDistance) {
      showDistance = false;
      drawLines();
      return;

    } else {
      if (distance != null && enableZooming) {
        doDistance = false;
        distance.innerHTML = distance.label_on;
      }

    }

    if (isDragging) {
      isDragging = false;
      return;
    }

    if (e.altKey) {
      HAniS.resetZoom();
      return;
    }

    if (doHoverzones && hoverInx >= 0 && showedHover) {
      doAction(hoverzones[hoverInx], "z");
      return;
    }

    xScreen = pointer.getX();
    yScreen = pointer.getY();

    if (numHotzones != 0) {
      for (var i=0; i<numHotzones; i++) {
        if (hotzones[i].overlay >= numOverlays ) {
          info(" Error...hotzone overlay # "+hotzones[i].overlay+" > number of overlays = "+numOverlays);
          continue;
        }
        
        if (overlayCheck[hotzones[i].overlay].checked) {
          ctx1.clearRect(0,0,1,1);
          ctx1.drawImage(overlayImages[curFrame][hotzones[i].overlay],Math.floor(xImage),Math.floor(yImage),1,1,0,0,1,1);
          rgb = ctx1.getImageData(0,0,1,1).data;
          rgbpack = (rgb[0]<<16) + (rgb[1]<<8) + rgb[2];

          if (rgbpack == hotzones[i].color) {
            doAction(hotzones[i], "z");
            return;
          }
        }
      }

    } 
    
    if (numHotspots != 0) {
      for (var i=0; i<numHotspots; i++) {
        if (hotspots[i].overlay != -1 &&
               !overlayCheck[hotspots[i].overlay].checked) continue; 

        if (xScreen > hotspots[i].x0 && xScreen < hotspots[i].x1 &&
            yScreen > hotspots[i].y0 && yScreen < hotspots[i].y1) {

           doAction(hotspots[i], "s");
           return;
        }
      }
    }

    if (enableZooming) {
      doHoverzones = false;
      if (e.ctrlKey) {
        zoomXFactor = zoomXFactor - 0.1*zoomScale;
        zoomYFactor = zoomYFactor - 0.1*zoomScale;

      } else {
        zoomXFactor = zoomXFactor + 0.1 * zoomScale;
        zoomYFactor = zoomYFactor + 0.1 * zoomScale;
        if (zoomXFactor > zoomFactorMax) zoomXFactor = zoomFactorMax;
        if (zoomYFactor > zoomFactorMax) zoomYFactor = zoomFactorMax;
      }

      if (zoomXFactor < zoomXBase || zoomYFactor < zoomYBase) {
        zoomXFactor = zoomXBase;
        zoomYFactor = zoomYBase;
        xImage = xScreen;
        yImage = yScreen;
        xMove = 0;
        yMove = 0;
        hImage = imgCan.height;
        wImage = imgCan.width;
        hideBottom = 0;
        hideTop = 0;
      } else {
        xMove = Math.round(xImage*zoomXFactor - xScreen)/zoomXFactor;
        yMove = Math.round(yImage*zoomYFactor - yScreen)/zoomYFactor;
        hImage = Math.floor(imgCan.height / zoomYFactor);
        if (yMove + hImage > (imgCan.height-hideBottom)) yMove = imgCan.height - hideBottom- hImage;
        wImage = Math.floor(imgCan.width / zoomXFactor);
        hideBottom = hideBottomDef;
        hideTop = hideTopDef;
      }
      setHiResZoomIndex();
    }
    drawIt();
    drawLines();
  }

  this.toggleAutoRefresh = function() {
    if (isAutoRefresh) {
      autotoggle.innerHTML = autotoggle.label_off;
      if (refreshTimer != null) clearInterval(refreshTimer);
      isAutoRefresh = false;
    } else {
      autotoggle.innerHTML = autotoggle.label_on;
      refreshTimer = setInterval("HAniS.reloadFOF();",autoRefresh);
      isAutoRefresh = true;
    }
  }

  this.toggleLoopRock = function() {
    if (isRocking) {
      if (looprock != null) looprock.innerHTML = looprock.label_on;
      isRocking = false;
    } else {
      if (looprock != null) looprock.innerHTML = looprock.label_off;
      isRocking = true;
    }
  }

  this.toggleExtrap = function() {
    if (isExtrap) {
      if (extrap != null) {
        extrap.innerHTML = extrap.label_on;
        divall.style.cursor = "default";
        isLooping = wasLooping;
        extrapMode = -1;
      }
      isExtrap = false;
      drawLines();
    } else {
      if (extrap != null) {
        isExtrap = true;
        dirspdLabel = null;
        divall.style.cursor = "crosshair";
        extrap.innerHTML = extrap.label_off;
        wasLooping = isLooping;
        isLooping = false;
        HAniS.resetZoom();
        initExtrap();
        drawLines();
      }
      drawIt();
    }
  }

  var initExtrap = function() {
    exMsg = 0;
    extrapX = new Array(2);
    extrapY = new Array(2);
    extrapT = new Array(2);
    extrapMode = 0;
    dirspdLabel = null;
    setCurrentFrame(0);
  }

  var setIsLooping = function(r) {
    isLooping = !r;
    HAniS.toggleIsLooping();
  }

  this.doEnhance = function(e) {
    if (!isBaseEnh && !isOverlayEnh) return;
    var h = enhCan[0].height;
    var w = enhCan[0].width;
    var t = parseInt(enhance.value,10);
    var odk, tr, tg, tb, ta;
    if (t >= 0) {
      tr = tabR[t];
      tg = tabG[t];
      tb = tabB[t];
      ta = tabA[t];
      overlayProbe[overlayEnhNum] = t;
    }
    var sd = h * w * 4;
    for (var i=0; i<origCan.length; i++) {
      if (enhCan[i].gotit) {
        enhCan[i].gotit = false;
        var ed = enhID[i].data;
        var od = origIDd[i];
        if (t < 0) {
          for (var k=0; k<sd; k=k+4) {
            ed[k] = od[k]
            ed[k+1] = od[k+1];
            ed[k+2] = od[k+2];
            ed[k+3] = od[k+3];
          }
        } else {
          for (var k=0; k<sd; k=k+4) {
            odk = od[k];
            if (odk === od[k+1] && odk === od[k+2]) {
              ed[k] = tr[odk];
              ed[k+1] = tg[odk];
              ed[k+2] = tb[odk];
              ed[k+3] = ta[odk];
            }
          }
        }
        ctxe[i].putImageData(enhID[i],0,0);
        enhCan[i].gotit = true;
      }
    }
  }

  this.overClick = function(e) {
    var i;
    okToShowHoverzones = true;
    for (i=0; i<overlayLinks.length; i++) {
      if (e.target != overlayCheck[i]) {
        resetLinks(i);
      }
      if (allowHoverzones != null && 
        (!allowHoverzones[i] && overlayCheck[i].checked)) okToShowHoverzones = false;

      if (enhance != null) {
        if (i == overlayEnhNum) {
          enhance.disabled = !overlayCheck[i].checked;
        }
      }
    }
    drawIt();
  }

  this.toggleIsLooping = function() {
    if (isLooping) {
      isLooping = false;
      if (startstop != null) startstop.innerHTML = startstop.label_on;
    } else {
      isLooping = true;
      if (startstop != null) startstop.innerHTML = startstop.label_off;
    }
  }


  this.toggleZooming = function() {
    if (enableZooming) {
      HAniS.resetZoom();
    } else {
      zoom.innerHTML = zoom.label_off;
      enableZooming = true;
      if (distance != null) {
        doDistance = false;
        distance.innerHTML = distance.label_on;
      }
      doHoverzones = false;
      if (isExtrap) HAniS.toggleExtrap();
    }
  }

  var setToggleState = function(n,s) {
    toggleFrames[n] = s;
    if (!useToggle) return;
    var x = togstart + n*(wTog + spTog);
    var c = "orange";
    if (s == 0) {
      c = "blue";
    } else if (s == -1) {
      c = "red";
    }
    ctxtog.fillStyle = c;
    ctxtog.fillRect(x,hTog/2, wTog, hTog);
  }

  this.togclick = function(e) {
    var x = togPointer.getX();
    var y = togPointer.getY();
    var xf = togstart;
    for (var i=0; i<toggleFrames.length; i++) {
      if (x > xf && x<xf + wTog) {
        // found it!
        var s = 0;
        if (toggleFrames[i] >= 0) s = -1;
        setToggleState(i, s);
        break;
      }
      xf = xf + wTog + spTog;
    }
  }

  var makeToggles = function(n) {
    if (useToggle) {
      cantog.width = imgCan.width;
      togstart = imgCan.width/2 - n*(wTog+spTog)/2;
    }
    for (var i=0; i<n; i++) {
      setToggleState(i,0);
    }

  }

  var setCurrentFrame = function(n) {
    setToggleState(curFrame,0);
    curFrame = n;
    setToggleState(curFrame,1);
  }

  var incCurrentFrame = function(n) {
    setToggleState(curFrame,0);
    do {
      if (n > 0) {
        curFrame = curFrame + 1;
        if (curFrame >= numFrames) {
          if (isRocking) {
            curFrame = numFrames - 1;
            direction = -direction;
          } else {
            curFrame = 0;
          }

        }
      } else {
        curFrame = curFrame - 1;
        if (curFrame < 0) {
          if (isRocking) {
            curFrame = 0;
            direction = -direction;
          } else {
            curFrame = numFrames - 1;
          }
        }
      }
    } while (toggleFrames[curFrame] < 0);

    setToggleState(curFrame,1);
    if (frameLabelField != null && frameLabels != null && 
                               frameLabels[curFrame] != null) {
      frameLabelField.innerHTML = frameLabels[curFrame];
    }
  }

  /** @constructor */
  function TextBox(bg, fg, font, scolor, sblur, sx, sy) {
    this.bg = bg;
    if (bg != null && this.bg.indexOf("0x") == 0) {
      this.bg = "#"+this.bg.substring(2);
    }
    this.fg = fg;
    if (fg != null && this.fg.indexOf("0x") == 0) {
      this.fg = "#"+this.fg.substring(2);
    }
    this.font = font;
    this.fontHeight = Math.round(1.1 * parseInt(font,10));
    this.scolor = scolor;
    if (scolor != null && this.scolor.indexOf("0x") == 0) {
      this.scolor = "#"+this.scolor.substring(2);
    }
    this.sblur = sblur;
    this.sxoff = sx;
    this.syoff = sy;
  }

  var drawText = function(box, x, y, text, lcr) {
    ctxd.globalAlpha = 1.0;
    ctxd.font = box.font;
    var fh = box.fontHeight;
    var yp = y - fh - 6;
    var zp = ctxd.measureText(text).width;
    var xp = x;
    if (lcr == 1) xp = xp - zp;
    if (lcr == 0) xp = xp - zp/2;

    if (xp < 5) xp = 5;
    if (yp < 5) yp = 5;
    if (yp + fh + 3 > drwCan.height) 
             yp = drwCan.height - fh - 6;
    if (xp + 3 + zp > drwCan.width) xp = drwCan.width - zp - 6;

    ctxd.save();
    ctxd.beginPath();
    ctxd.fillStyle = box.bg;
    if (box.scolor != null) {
      ctxd.shadowColor = box.scolor;
      ctxd.shadowBlur = box.sblur;
      ctxd.shadowOffsetX = box.sxoff;
      ctxd.shadowOffsetY = box.syoff;
    }
    xText = xp - 3;
    yText = yp;
    wText = zp + 6;
    hText = fh + 6;

    ctxd.fillRect(xText,  yText, wText, hText);
    ctxd.closePath();
    ctxd.restore();

    ctxd.textBaseline = "bottom";
    ctxd.fillStyle = box.fg;
    ctxd.fillText(text, xp, yp + fh + 3);
  }

  var drawLines = function() {

    ctxd.clearRect(0,0,drwCan.width,drwCan.height);  // erase
    showedHover = false;

    if (isExtrap) {
      var pp = 15;
      ctxd.beginPath();
      ctxd.lineWidth = 2;
      ctxd.strokeStyle = "white";
      var ir = extrapMode;
      if (ir > 1) ir = 2;
      for (var i=0; i<ir; i++) {
        if (extrapMode > 1) {
          ctxd.moveTo(extrapX[0], extrapY[0]);
          ctxd.lineTo(extrapX[1], extrapY[1]);
        }
        ctxd.moveTo(extrapX[i] - pp, extrapY[i]);
        ctxd.lineTo(extrapX[i] + pp, extrapY[i]);
        ctxd.moveTo(extrapX[i], extrapY[i] - pp);
        ctxd.lineTo(extrapX[i], extrapY[i] + pp);
      }

      ctxd.closePath();
      ctxd.stroke();

      if (extrapMode == 3) {

        var x = xScreen;
        var y = yScreen;

        ctxd.moveTo(x,y);
        ctxd.fillStyle = timeColor;

        ctxd.fillRect(x-2, y-2, 5, 5);

        var accumTime = tmin;
        var endX = Math.round(x + exsign*(dxdt*(tmin - extrapT[1])));
        var endY = Math.round(y + exsign*(dydt*(tmin - extrapT[1])));

         // fillRect(x-2,y-2,5,5)

        for (var gasp=0; gasp < 300; gasp++) {

           ctxd.beginPath();
           ctxd.lineWidth = 1;
           ctxd.strokeStyle = timeColor;
           ctxd.moveTo(x,y);
           ctxd.lineTo(endX, endY);
           ctxd.stroke();
           ctxd.beginPath();
           ctxd.lineWidth = 3;
           ctxd.rect(endX-2, endY-2, 5,5);
           ctxd.stroke();

           if (endX < 3 || (endX+3) > drwCan.width ||
               endY < 3 || (endY+3) > drwCan.height) break;

           var hm = startingMinute + accumTime;
           hm = 100*Math.floor(hm/60) + (hm % 60);
           hm = hm % 2400;

           var shm;
           if (extrapAMPM) {

             var hampm= "AM";
             if (hm >= 1200) {
               if (hm >= 1300) hm = hm - 1200;
               hampm = "PM";
             } else if (hm < 100) {
               hm = hm + 1200;
             }
             shm = Math.floor(hm/100) +":"+ Math.floor(Math.floor(hm % 100)/10) + Math.floor(hm % 10) + " "+hampm;

           } else {
             shm = hm+" ";
             if (hm < 1000) shm = "0"+hm;
             if (hm < 100) shm = "00"+hm;
             if (hm < 10) shm = "000"+hm;
           }

           // here we draw the time label.....
           //background = timeBack
           // foreground = timeColor;
           // "timeFontSize" and timeFontWeight....
           // lab.text = StringUtil.trim(shm+" "+tzLabel);

           var rot = 0.0;
           if (Math.abs(yInc) < (timeFontSize+5)) {
             rot = 45.*.0174533;
           }

           var yb = endY;
           if (xInc * yInc < 0 && rot == 0) {
             yb = endY + timeFontSize;
           }
           ctxd.font = timeFont;
           shm = shm + " " + tzLabel;
           var zp = ctxd.measureText(shm).width;
           ctxd.fillStyle = timeBack;

           if (rot === 0.0) {
             ctxd.fillRect(endX+2, yb - timeFontSize-2 + rot, zp+4, timeFontSize+3);
             ctxd.fillStyle = timeColor;
             ctxd.textBaseline = "bottom";
             ctxd.fillText(shm, endX+5, yb);
           } else {

             ctxd.save();
             ctxd.translate(endX+5,endY);
             ctxd.rotate(rot);
             ctxd.fillRect(2, -2, zp+4, timeFontSize+3);
             ctxd.fillStyle = timeColor;
             ctxd.textBaseline = "bottom";
             ctxd.fillText(shm, 5, timeFontSize);
             ctxd.restore();
           }

           x = endX;
           y = endY;
           endX = Math.round(x + exsign*xInc);
           endY = Math.round(y + exsign*yInc);
           accumTime = accumTime + nmin;
         }

       }

       if (dirspdLabel != null) {
         drawText(dirspdBox, dirspdX, dirspdY, dirspdLabel, 0);
       }
       drawText(extrapTB, 999, 10, extrapPrompts[exMsg], 0);
       extrapXbeg = xText;
       extrapHbeg = hText;
    }

    if (showDistance) {
      
      var dx = distXScale *(x0Dist - x1Dist)/zoomXFactor;
      var dy = distYScale *(y0Dist - y1Dist)/zoomYFactor;
      var distVal = " "+(Math.sqrt(dx*dx + dy*dy)).toFixed(distDigits)+" "+distUnit+" ";

      drawText(distBox, x1Dist, y1Dist, distVal, -1);

      ctxd.beginPath();
      ctxd.strokeStyle = distLineColor;
      ctxd.lineWidth = 3;
      ctxd.moveTo(x0Dist, y0Dist);
      ctxd.lineTo(x1Dist, y1Dist);
      ctxd.stroke();
      ctxd.closePath();
    }

    if (showTip) {
      drawText(tipBox, tipX, tipY, tipText, -1);
    }

    if (showProbe) {
      xScreen = pointer.getX();
      yScreen = pointer.getY();
      if (xScreen >= 0 && yScreen >= 0) {
        xImage = Math.round(xMove + xScreen/zoomXFactor);
        yImage = Math.round(yMove + yScreen/zoomYFactor);

        for (var k=0; k<numOverlays; k++) {
          if (overlayImages[curFrame][k].gotit && 
              overlayCheck[k].checked && (k == overlayEnhNum ||
              (overlayProbe[k] != null && overlayProbe[k] >= 0))) {

            ctx1.clearRect(0,0,1,1);
            if (k == overlayEnhNum) {
              ctx1.drawImage(origCan[curFrame],xImage,yImage,1,1,0,0,1,1);
            } else {
              ctx1.drawImage(overlayImages[curFrame][k],xImage,yImage,1,1,0,0,1,1);
            }
            rgb = ctx1.getImageData(0,0,1,1).data;

            minDiff = 999;
            tn = overlayProbe[k];
            var value = "Undefined";

            if (rgb[3] == 0) {
              value = tabMissing[tn];
              
            } else {
              if (k == overlayEnhNum) {
                diffPct = 0.0;
                diffInx = rgb[0];
                minDiff = 0;
              } else {

                for (var i=0; i<tabVal[tn].length-1; i++) {

                  drgb[0] = (rgb[0] - tabR[tn][i]);
                  if (drgb[0]*(tabR[tn][i+1] - rgb[0]-1) < 0) continue;

                  drgb[1] = (rgb[1] - tabG[tn][i]);
                  if (drgb[1]*(tabG[tn][i+1] - rgb[1]-1) < 0) continue;

                  drgb[2] = (rgb[2] - tabB[tn][i])
                  if (drgb[2]*(tabB[tn][i+1] - rgb[2]-1) < 0) continue;

                  minx = tabInx[tn][i];
                  pct = drgb[minx]/tabDif[tn][i][minx];

                  diff = 
                   Math.abs(drgb[m1[minx]] - pct*tabDif[tn][i][m1[minx]])+ 
                   Math.abs(drgb[m2[minx]] - pct*tabDif[tn][i][m2[minx]]);

                   if (diff < minDiff) {
                     diffInx = i;
                     minDiff = diff;
                     diffPct = pct;
                   }

                }
              }

              if (minDiff < 999) {
                value = tabPrefix[tn][diffInx];
                if (tabDecimal[tn][diffInx] != -1) {
                  var dbzz = tabVal[tn][diffInx] + 
                    diffPct*(tabVal[tn][diffInx+1] - tabVal[tn][diffInx]);
                  value = value+" "+ dbzz.toFixed(tabDecimal[tn][diffInx])+
                          " "+tabUnit[tn][diffInx];
                }
              }  else {
                info("RGB err: R="+rgb[0]+" G="+rgb[1]+" B="+rgb[2]);
              }
            }

            drawText(probeBox, xScreen-10, yScreen, value, 1);
      
          }
        }
      }
    }

    if (doHoverzones && !isExtrap && !doDistance && !showProbe) {
      if (hoverInx < 0) return;
      ctxd.drawImage(hoverzones[hoverInx].can,
        hoverzones[hoverInx].xmin, hoverzones[hoverInx].ymin);

      var xx = (hoverzones[hoverInx].xmin + hoverzones[hoverInx].xmax)/2
      var yy = (hoverzones[hoverInx].ymin + hoverzones[hoverInx].ymax)/2

      drawText(tipBox, xx, yy, hoverzones[hoverInx].tip, 0);
      showedHover = true;
    }

  }

  var drawIt = function() {
    var i;
    if (!gotImages) return;
    try {
      ctx.width = ctx.width;

      ctx.globalAlpha = 1.0;
      if (doingHiResZoom && hiResBase != null && hiResZoomIndex >= 0 && hiResBase[hiResZoomIndex].gotit) {
         ctx.drawImage(hiResBase[hiResZoomIndex],xMove*hiResZoomLevel[hiResZoomIndex],yMove*hiResZoomLevel[hiResZoomIndex],wImage*hiResZoomLevel[hiResZoomIndex],hImage*hiResZoomLevel[hiResZoomIndex],0,0,imgCan.width, imgCan.height);

      } else {
        if (backImages[curFrame].gotit) {
           ctx.drawImage(backImages[curFrame],xMove,yMove,wImage,hImage,0,0,imgCan.width, imgCan.height);
         }

        if (preserveBackPoints != null) {
          ctx.globalAlpha = 1.0;
          if (backImages[curFrame].gotit) {
            for (var ii = 0; ii < preserveBackPoints.length; ii=ii+4) {
              ctx.drawImage(backImages[curFrame],
                preserveBackPoints[ii], preserveBackPoints[ii+1], 
                  preserveBackPoints[ii+2], preserveBackPoints[ii+3],
                  preserveBackPoints[ii], preserveBackPoints[ii+1], 
                  preserveBackPoints[ii+2], preserveBackPoints[ii+3]);
            }
          }
        }
      }


      if (numOverlays > 0) {
        for (var ii=0; ii<numOverlays; ii++) {
          i = (overlayOrder != null) ? overlayOrder[ii] : ii;
          if (overlayCheck[i].checked) {
            if (doingHiResZoom && hiResOlay != null && hiResZoomIndex >= 0 &&
                    hiResOlay[hiResZoomIndex].gotit && hiResOlayIndex == i) {
                ctx.drawImage(hiResOlay[hiResZoomIndex],xMove*hiResZoomLevel[hiResZoomIndex],yMove*hiResZoomLevel[hiResZoomIndex],wImage*hiResZoomLevel[hiResZoomIndex],hImage*hiResZoomLevel[hiResZoomIndex],0,0,imgCan.width, imgCan.height); 

            } else {
              if (overlayImages[curFrame][i].gotit) {
                if (overlayAlpha != null) ctx.globalAlpha = overlayAlpha[i];
                if (olayZoomIndex == null || olayZoomIndex[i]) {
                  ctx.drawImage(overlayImages[curFrame][i],xMove,yMove,wImage,hImage,0,0,imgCan.width, imgCan.height); 
                } else {
                  ctx.drawImage(overlayImages[curFrame][i],0,0);
                }
              }
              
            }
          }
        }

        if (preserveIndex != null) {
          ctx.globalAlpha = 1.0;
          for (var ii=0; ii<numOverlays; ii++) {
            i = (overlayOrder != null) ? overlayOrder[ii] : ii;
            if (overlayImages[curFrame][i].gotit && 
                     overlayCheck[i].checked && preserveIndex[i]) {
                ctx.drawImage(overlayImages[curFrame][i],
                preservePoints[i][0], preservePoints[i][1], 
                preservePoints[i][2], preservePoints[i][3],
                preservePoints[i][0], preservePoints[i][1], 
                preservePoints[i][2], preservePoints[i][3]);
            }
          }
        }

        if (showProbe) drawLines();
      }

      if (useProgress) drawProgress();

      if (isIconHotspot) {
        ctx.globalAlpha = 1.0;
        for (i=0; i<numHotspots; i++) {
          if (hotspots[i].icon != null) {
            if (hotspots[i].icon.gotit) {
              ctx.drawImage(hotspots[i].icon, hotspots[i].x0, hotspots[i].y0);
            }
          }
        }
        
      }

    } catch (errx) {
      info("Error:"+errx);
    }
  }

  var drawProgress = function() {
    if (showProgress && imgCount > imgGotCount) {
      ctx.save();
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.strokeRect(progX,progY,200,14);
      ctx.fillRect(progX,progY,200*(imgGotCount / imgCount),14);
      var s = "Loading images";
      var w = ctx.measureText(s).width;
      ctx.fillStyle = "orange";
      ctx.font = "14px arial";
      ctx.fillText(s, progX + 100 - w/2, progY+11);
      ctx.restore();
    } else {
      useProgress = false;
    }
  }

  var info = function(s) {
    if (debug && debugWindow && !debugWindow.closed) {
      try {
      debugWindow.document.write(s+"<br>");
      } catch (err) {
      }
    }
  }


  var run = function() {
      if (isLooping) incCurrentFrame(direction);
      if (curFrame == numFrames-1) {
        delay = lastDwell+dwell;
      } else {
        delay = dwell;
      }
      drawIt();
      setTimeout( function() {
        requestAnimationFrame(run);
      }, delay);

  }


}

