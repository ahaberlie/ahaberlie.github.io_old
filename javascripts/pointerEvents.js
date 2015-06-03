/** @constructor */
function PEvs (ele, down, up, move, drag, click, stopped) {
  var touches, first, isTouching, isDown, downTime, upTime, durTime;
  var element, offsetLeft, offsetTop, didMove, sentStop, timer;
  var callUp, callDown, callDrag, callMove, callClick, callStopped;
  var x = 0;
  var y = 0;
  var oldX, oldY;

  var getPosition = function(event) {
    element = event.target; 
    offsetLeft=0; 
    offsetTop=0;
    while (element) {
      offsetLeft += element.offsetLeft;
      offsetTop += element.offsetTop;
      element = element.offsetParent;
    }
     
    x = event.clientX - offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = event.clientY - offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

  };

  this.getX = function() { 
    return x; 
  }
  this.getY = function() { 
    return y; 
  }

  var doDown = function(e) {
    getPosition(e);
    oldX = x;
    oldY = y;
    isDown = true;
    if (callClick != null) downTime  = new Date().getTime();
    if (callDown != null) callDown(e);  // get er rolling
  }

  var doUp = function(e) {
    getPosition(e);
    isDown = false;
    if (callUp != null) callUp(e);
    if (callClick != null) {
      upTime = (new Date()).getTime();
      durTime = upTime - downTime;
      if (durTime < 300) callClick(e);
    }
  }

  var doMove = function(e) {
    getPosition(e);
    if (Math.abs(x - oldX) < 3 && Math.abs(y - oldY) < 3) {
      return;
    }

    oldX = -9999;
    oldY = -9999;

    if (isDown) {
      if (callDrag != null) callDrag(e);
    } else {
      if (callMove != null) callMove(e);
    }
    if (callStopped != null) doDidMove();
  }

  this.touchDown = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    isTouching = true;
    touches = e.changedTouches; 
    first = touches[0];
    doDown(first);
  };

  this.touchUp= function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    isTouching = true;
    touches = e.changedTouches; 
    first = touches[0];
    doUp(first);
  };

  this.touchMove = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    isTouching = true;
    touches = e.changedTouches;
    first = touches[0];
    doMove(first);
  };

  this.mouseDown = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    if (isTouching) return;
    doDown(e);
  };

  this.clearDown = function() {
    isDown = false;
  }

  this.mouseUp = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    if (isTouching) return;
    doUp(e);
  };

  this.mouseClick = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    isDown = false;
  };

  this.mouseMove = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    if (isTouching) return;
    doMove(e);
  };

  this.mouseDragged = function(e) {
    e.preventDefault();
    if (e.stopImmediatePropagation) {
      e.stopImmediatePropagation();
    } else {
      e.stopPropagation();
    }
    if (isTouching) return;
    getPosition(e);
    if (callDrag != null) callDrag(e);
    if (callStopped != null) doDidMove();
  };

  var doDidMove = function() {
    clearTimeout(timer);
    timer = setTimeout( function() {
      callStopped();
    },600 );
  }

  x = 0;
  y = 0;
  oldX = 0;
  oldY = 0;
  callDown = down;
  callUp =up;
  callMove = move;
  callDrag = drag;
  callClick = click;
  callStopped = stopped;
  isTouching = false;
  isDown = false;
  didMove = false;
  sentStop = true;
  ele.addEventListener("touchstart",this.touchDown,false);
  ele.addEventListener("touchend",this.touchUp,false);
  ele.addEventListener("touchmove",this.touchMove,false);
  ele.addEventListener("pointerdown",this.mouseDown,false);
  ele.addEventListener("pointerup", this.mouseUp, false);
  ele.addEventListener("pointermove",this.mouseMove, false);
  ele.addEventListener("mousedown",this.mouseDown,false);
  ele.addEventListener("mouseup", this.mouseUp, false);
  ele.addEventListener("mousemove",this.mouseMove, false);
  ele.addEventListener("click",this.mouseClick, false);
  ele.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  }, false);

  ele.addEventListener("mouseout", function(e) {
    if (!isDown) {
      x = -1;
      y = -1;
      if (callMove != null) callMove(e); 
    }
    isDown = false;
  });

}

