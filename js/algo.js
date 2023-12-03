var canvas = document.getElementById('nokey'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

// console.log(typeof can_w);

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       r: 255,
       g: 0,
       b: 4
   },
   R = 10,
   balls = [],
   alpha_f = 0.01,
   alpha_phase = 0,
    
// Line
   link_line_width = 0.9,
   dis_limit = 400,
   add_mouse_point = true,
   mouse_in = true,
   mouse_ball = {
      x: 30,
      y: 30,
      vx: 0,
      vy: 0,
      r: 20,
      type: 'mouse'
   };

// Random speed
function getRandomSpeed(pos){
    var  min = -1,
       max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}
console.log(randomNumFrom(0, 10));
// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;
        
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();

               ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               ctx.lineWidth = link_line_width;
               
               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < 100){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderLines();
	
	renderBalls();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}
// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(100);
    window.requestAnimationFrame(render);
}
goMovie();

// Mouse effect
canvas.addEventListener('mouseenter', function(){
    console.log('mouseenter');
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    console.log('mouseleave');
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
    // console.log(mouse_ball);
});




$matrixAdj = [];
// on cree le tableau bleu, contenant les lignes
$nbVertexes= 5;
$vertexes=[];
$nbCc=0;
//$pointArticul=[];
$Nodes=[];
var $cy;
$(document).ready(function(){
  $('#nbNode').keypress(function (e) {
   var key = e.which;
   if(key == 13)  // the enter key code
    {
      $nbVertexes= i=$("#nbNode").val();
      initMatrix();
      createNodes();
      initGraph();
    }
  });
  $('#SecondNode').keypress(function (e) {
   var key = e.which;
   if(key == 13)  // the enter key code
    {
      var i,j;
       i=$("#FirstNode").val();
       j=$("#SecondNode").val();
        $matrixAdj[i-1][j-1]=1;
        $matrixAdj[j-1][i-1]=1;
        updateEdges(i,j);
    }
  });
  $("#valider").click(function(){
    initVertexes();
    $nbCc=NCC(-1);//Initial number of CC
      articulationPoints();

  });
});
function initMatrix(){
  var i,j;
 for(i = 0; i < $nbVertexes; i++){
     $matrixAdj[i] = [];
     for(j = 0; j < $nbVertexes; j++){
        {$matrixAdj[i][j] = 0;
        }
     }
 }
}
function initVertexes(){
  var i=0;
  $vertexes=[];
  for (i=0;i<$nbVertexes;i++)
  $vertexes[i]=false;
}
function DFS($vertex,$vertexNotV){
  var pile=[];
  pile.push($vertex);
  var i;
  while (pile.length>0)
    {
        // pop
        $vertex=pile.pop();
        //alert('poping '+$vertex);
        if ($vertexes[$vertex]==false){
            //alert('Visiting '+$vertex);
           $vertexes[$vertex]=true;//Visited
           for (i=0;i<$vertexes.length;i++)
           {
             if (i!=$vertexNotV)
               if($matrixAdj[$vertex][i]==1)
                if($vertexes[i]==false){
                  //alert('pushing '+i);
                   pile.push(i);
                 }
           }
         }
    }
}
function NCC($vertexNotV){
   var nbCCtmp=0;
   var i;
   for(i=0;i<$vertexes.length;i++)
     if(i!=$vertexNotV)
       if($vertexes[i]==false)
        {
          DFS(i,$vertexNotV);
         nbCCtmp++;
       }
        return nbCCtmp;
}
function articulationPoints(){
  var i;
  var k=0;
  for (i=0;i<$vertexes.length;i++)
    {
      initVertexes();
      var tmpCC=NCC(i);
      // if (tmpCC!=$nbCc)
      if (tmpCC>$nbCc)
         { //$pointArticul[k]=i+1;
           console.log(i);
           ColorArtPoit(i);//Color the articulation vertex
           k++;
         }
    }
}
function createNodes(){
    $Nodes=[]; //Initialize Nodes Matrix
    for (var i = 0; i<$nbVertexes; i++) {
        $Nodes.push({
            data: {
                id: i+1,
                name:i+1
            }
        });
    }
}
function updateEdges(FirstNode,SecondNode){
  $cy.add({
    group: "edges",
    data: {source:FirstNode,
    target:SecondNode },
});
}
function initGraph(){
  var Style =  cytoscape.stylesheet().selector('node').css({
    'background-color': '#f1982e',
    'label': 'data(id)',
    'color':'#ffffff'
      }).selector('edge').css({
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      })
 $cy=cytoscape({
   container: $('#graph-container'),
    elements:{
       nodes: $Nodes,
    },
    style:Style,
    layout: {
      name: 'random',
    },
 });
}
function ColorArtPoit($i){
    $cy.nodes()[$i].css({
    'background-color': '#27ae60'
     });
}
