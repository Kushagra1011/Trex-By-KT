var PLAY = 1; 
var END = 0; 

//var message = "I AM TREX"; 


var gamestate = PLAY; 

var trex,collided, trex_running,trex_stop, ground, ground_moving, invisible_ground, cloud1, cloud,cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6,restart_game,gameover,game_over; 

//Variables For sound 
var sound_checkpoint,sound_die,sound_jump; 

function preload() 
{ 
  trex_running  =  loadAnimation("trex1.png","trex3.png", "trex4.png"); 
  trex_stop=loadAnimation("trex_collided.png"); 
  // Multiple Animation Syntax  
  ground_moving = loadAnimation("ground2.png");  
  cloud1=loadImage("cloud.png"); 
  cactus1=loadImage("obstacle1.png"); 
  cactus2=loadImage("obstacle2.png");
  cactus3=loadImage("obstacle3.png");
  cactus4=loadImage("obstacle4.png"); 
  cactus5=loadImage("obstacle5.png");
  cactus6=loadImage("obstacle6.png");
  
  game_restart=loadImage("restart.png");
  game_over=loadImage("gameOver.png"); 
  
  sound_checkpoint=loadSound("checkPoint.mp3"); 
  sound_die=loadSound("die.mp3"); 
  sound_jump=loadSound("jump.mp3"); 
  
  
}  
  
function setup()
{
  createCanvas(600,200)  
  trex = createSprite(50, 160, 20, 50)
  trex.addAnimation("running", trex_running); 
  trex.addAnimation("collided", trex_stop); 
  trex.scale=0.5; 
  
  restart_game=createSprite(300,100,20,20);
  restart_game.addImage(game_restart); 
  restart_game.scale=0.6; 
  
  gameover=createSprite(300,150,20,20); 
  gameover.addImage(game_over); 
  gameover.scale=0.5; 
  
  ground = createSprite(300, 180, 600, 5)
  ground.addAnimation("ground", ground_moving);  
  
  invisible_ground=createSprite(0,183, 600, 5); 
  invisible_ground.visible=false; 
  
  var rand = Math.round(random(1,600)); 
  //console.log(rand); 
  
  var message = "I AM TREX"; 
  //console.log(message); 
  
  trex.setCollider("circle",0,0,50); 
  trex.debug=true; 
  
  
  cloudsGroup=new Group();
  cactusGroup=new Group(); 
}
  

  var score=0;

function draw()
{
  //console.time(); 
  
  background("black"); 
  
  
  //console.log(trex.depth); 
  //console.log(message);
  
  if (gamestate===PLAY)
  {
    ground.velocityX=-(10+score/200);
        
    if (keyDown("space") && trex.y>150)
  {
      trex.velocityY=-12; 
      sound_jump.play(); 
  } 
    
  if (ground.x < 0)
  {
      ground.x=ground.width/2; 
  }
  trex.velocityY = trex.velocityY+0.65; 
  score=score+Math.round(getFrameRate()/60); 
  
    drawClouds(); 
  
    spawnCactus();
    
    if (cactusGroup.isTouching(trex))
  {
    gamestate=END; 
    //trex.velocityY = -10; 
    sound_die.play(); 
  }
    
    gameover.visible=false; 
    restart_game.visible=false;
    
    checkpoint(); 
    
  }
  
  else if (gamestate===END)
  {
      ground.velocityX=0;  
      trex.y= 160; 
      trex.x=50; 
      cloudsGroup.setVelocityXEach(0);
      cloudsGroup.setLifetimeEach(-1);  
      cactusGroup.setVelocityXEach(0);
      cactusGroup.setLifetimeEach(-1);
      
      trex.changeAnimation("collided", trex_stop); 
      
    gameover.visible=true; 
    restart_game.visible=true;
    
    
  }
  
  
  trex.collide(invisible_ground);  
  
  fill("White")
  textSize(20); 
  text("Score-"+score,485,20); 
   
  if (mousePressedOver(restart_game))
    {
      reset(); 
    }

  
  drawSprites(); 
  
  //console.timeEnd(); 
}

function drawClouds()
{
  if (frameCount%175===0)
  {
    cloud = createSprite(525,50,20,20 ); 
    cloud.addImage(cloud1); 
    cloud.scale=0.75;
    cloud.y=Math.round(random(1,100)); 
    cloud.velocityX=-3  ; 
    
    cloud.lifetime=200; 
    
    cloudsGroup.add(cloud); 
    
    cloud.depth=trex.depth; 
    trex.depth=trex.depth+1; 
    //console.log(cloud.depth);
  }
}
function spawnCactus()
{
  if(frameCount%100===0)
  {
    cactus=createSprite(575,160,20,20); 
    cactus.velocityX=-(7+score/200); 
    cactus.scale=0.5; 
    cactus.lifetime=120; 
    var switchit = Math.round(random(1,6)); 
    switch(switchit) 
    {
      case 1:cactus.addImage(cactus1); 
      break; 
      case 2:cactus.addImage(cactus2); 
      break;
      case 3:cactus.addImage(cactus3); 
      break;
      case 4:cactus.addImage(cactus4); 
      break; 
      case 5:cactus.addImage(cactus5); 
      break;
      case 6:cactus.addImage(cactus6); 
      break;
      default:break; 
      
    }
    cactusGroup.add(cactus); 
  }
}
      
function checkpoint()
{
  if (score>0 && score%100===0)
  {
    sound_checkpoint.play();
  }
}         

function reset()
{
  //if (mousePressedOver)
  gamestate=PLAY; 
  gameover.visible=false; 
  restart_game.visible=false;
  sound_die.stop();  
  cloudsGroup.destroyEach(); 
  cactusGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score=0; 
}
