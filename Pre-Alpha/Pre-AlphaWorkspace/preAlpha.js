let Level5 = 
{
    key: "Level 5",
    active: false,
    preload: Level5preload,
    create: Level5create,
    update: Level5update
}

let TitleScreen = 
{
    key: "titlescreen",
    active: true,
    preload: Titlepreload,
    create: Titlecreate
}

let InstructionScreen = 
{
    key:"instructions",
    active: false,
    preload: Instructionpreload,
    create: Instructioncreate
}

let EndScreen = 
{
    key:"endscreen",
    active: false,
    preload: Endpreload,
    create: Endcreate
}





let config = {
    type: Phaser.WEBGL,
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics:
    {
        default: "arcade",
        arcade: 
        {
            debug:false
        }
    },
    scene: [TitleScreen, InstructionScreen, EndScreen, Level5]
};

let game = new Phaser.Game(config);




function Titlepreload()
{
    this.load.atlas("ghost","assets/sprites/GhostHelper.png","assets/sprites/GhostHelper.json");
}

function Titlecreate()
{
    this.add.text(270, 100, "The Demons We Make");
    let ghost = this.physics.add.sprite(400, 300, "ghost", "ghost-halo-1.png");
    ghost.setImmovable();

    this.anims.create(
        {
            key: "ghostanimation",
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "ghost-halo-",
                start:1,
                end: 4,
                suffix:".png"
            }),
            repeat: -1,
            frameRate: 8
        }
    );

    ghost.anims.play("ghostanimation",true);

    this.add.text(100, 550, "Press TAB to see instructions. Press ENTER to move to game.");

    let key1 = this.input.keyboard.addKey("ENTER");

    let key2 = this.input.keyboard.addKey("TAB");

    key1.on(
        'down',
        transitionToGame,
        this
    );

    key2.on(
        'down',
        transitionToInstructions,
        this
    );
}



function transitionToGame()
{
    this.scene.start("Level 5");
}


function transitionToInstructions()
{
    this.scene.start("instructions");
}














function Instructionpreload ()
{
    this.load.image("instructions", "assets/InstructionsPage.png");
}

function Instructioncreate()
{
    this.add.image(400,300, "instructions");

    let key = this.input.keyboard.addKey("ESC");

    key.on(
        "down",
        transitionToTitle,
        this
    );
}


function transitionToTitle()
{
    this.scene.start("titlescreen");
}










function Endpreload()
{

}

function Endcreate()
{
    let Endtext = this.add.text(300,300, "Game Over");
    Endtext.setScale(2);
}








let player;
let cursors;
let longsword = {
    key: "Long Sword",
    damage: 5,
    cost: 0
};
let chainMail = {
    key: "Chain Mail",
    hearts: 5,
    cost: 0
}
let currentWeapon = 0;
let currentArmor = 0;
let weapons = [longsword];
let armors = [chainMail];
let backgroundmusic;



let myWalkingLayer;
let ceilingWallLayer;
let wall1;
let wall2;

function Level5preload()
{
    this.load.atlas("hero", "/assets/sprites/Hero.png", "/assets/sprites/Hero.json");
    this.load.image("castleTiles","assets/TileMap/gothic-castle-fullTileset.png");
    this.load.tilemapTiledJSON("gothic-castle-map","assets/TileMap/CastleTileMap.json");
    this.load.audio("gothic-castle-backgroundMusic","assets/Music/ViktorKraus-IntotheRuins.ogg");
    this.load.image("walls", "assets/TileMap/gothic-castle-wall.png");

}


function Level5create()
{
    this.physics.world.setBounds(0,0,2000,640);
    this.physics.world.setBoundsCollision(true,true,true,true);


    //create tile map
    let Map = this.make.tilemap({key: "gothic-castle-map", tileWidth: 16, tileHeight: 16});

    let myTileSet = Map.addTilesetImage("gothic-castle-fullTileset", "castleTiles");

    let myBackground = Map.createLayer("Background",myTileSet,0,0);
    let myBackground2 = Map.createLayer("Background2", myTileSet,0,0);
    ceilingWallLayer = Map.createLayer("Ceiling/Walls", myTileSet,0,0);
    myWalkingLayer = Map.createLayer("WalkingLayer",myTileSet,0,0);

    myBackground.setDepth(-3);
    myBackground2.setDepth(-2);

    myWalkingLayer.setCollisionByProperty({collide:true});
    ceilingWallLayer.setCollisionByProperty({collide:true});

    //hero creation
    player = this.physics.add.sprite(20,220,"hero", "gothic-hero-idle1.png");
    player.setGravityY(160);
    player.body.setCollideWorldBounds(true);


    //hero custom properties
    player.custom_onGround = true;
    player.custom_Direction = "right";
    player.custom_attackState = false;
    player.custom_currentWeapon = weapons[currentWeapon];
    player.custom_currentArmor = armors[currentArmor];
    player.custom_baseHealth = 4;
    player.custom_hp = player.custom_baseHealth + player.custom_currentArmor.hearts;
    player.custom_inBossRoom = false;


    //camera placement

    let mycamera = this.cameras.main;
    mycamera.startFollow(player);

    mycamera.setBounds(0,0,Map.widthInPixels, Map.heightInPixels);


    //hero animations
    this.anims.create(
        {
            key: "idle",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-idle",
                start:1,
                end: 4,
                suffix:".png"
            }),
            repeat: -1,
            frameRate:7
        }
    );

    this.anims.create(
        {
            key: "jump",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-jump",
                start:1,
                end: 5,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );

    this.anims.create(
        {
            key: "run",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-run",
                start:1,
                end: 12,
                suffix:".png"
            }),
            repeat: -1,
            frameRate:7
        }
    );

    this.anims.create(
        {
            key: "attack",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-attack",
                start:1,
                end: 6,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );

    this.anims.create(
        {
            key: "jumpAttack",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-jumpAttack",
                start:1,
                end: 4,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );

    //walls


    wall1 = this.physics.add.sprite(1700,510,"walls");
    wall2 = this.physics.add.sprite(1150,510,"walls");

    wall1.setScale(0.7);
    wall1.disableBody(true,true);
    wall1.setImmovable();
    wall2.setScale(0.7);
    wall2.disableBody(true,true);
    wall2.setImmovable();



    //input
    this.input.keyboard.on("keydown-A", attackAction, this);
    cursors = this.input.keyboard.createCursorKeys();

    let key = this.input.keyboard.addKey("E");
    key.on(
        "down",
        transitionToEnd,
        this
    );

    //audio
    backgroundmusic = this.sound.add("gothic-castle-backgroundMusic");


    //collisions
    this.physics.add.collider(myWalkingLayer, player, hitGround, null, this);
    this.physics.add.collider(ceilingWallLayer, player);
    this.physics.add.collider(wall1, player);
    this.physics.add.collider(wall2, player);
    //this.physics.add.collider(enemy,player, attackEnemy, null, this);
    

    console.log("Current armor: "+player.custom_currentArmor.key+"\tCurrent weapon: "+player.custom_currentWeapon.key);


    backgroundmusic.play({volume: 0.4, loop: true});
}


function Level5update()
{


    //hero movement
    if(cursors.left.isDown && !player.custom_attackState)
    {
        if(player.custom_Direction === "right")
        {
            player.toggleFlipX();
            player.custom_Direction = "left";
        }
        if(player.custom_onGround)
        {
            player.anims.play("run",true);
        }
        player.setVelocityX(-160);
        player.body.setSize();
    }
    else if(cursors.right.isDown && !player.custom_attackState)
    {
        if(player.custom_Direction === "left")
        {
            player.toggleFlipX();
            player.custom_Direction = "right";
        }
        if(player.custom_onGround)
        {
            player.anims.play("run",true);
        }
        player.setVelocityX(160);
        player.body.setSize();
    }
    else if(!player.custom_attackState){
        if(player.custom_onGround)
        {
            player.anims.play("idle",true);
        }
        player.setVelocityX(0);
        player.body.setSize();
    }

    if(cursors.up.isDown && player.custom_onGround && !player.custom_attackState)
    {
        player.custom_onGround = false;
        player.setVelocityY(-160);
        player.anims.play("jump");
        player.body.setSize();
    }

    if((!player.custom_inBossRoom) && (player.x > 1160) && (player.y > 500))
    {
        wall1.enableBody(true, 1700, 510, true, true);
        wall2.enableBody(true, 1150, 510, true, true);
        player.custom_inBossRoom = true;
    }

}


function attackAction()
{
    if(!player.custom_attackState)
    {
        if(player.custom_onGround){
            player.custom_attackState = true;
            player.setVelocityX(0);
            player.anims.play("attack");
            player.on('animationcomplete',function()
            {
                player.custom_attackState = false
            });
        }
        else{
            player.custom_attackState = true;
            player.anims.play("jumpAttack");
            player.on('animationcomplete',function()
            {
                player.custom_attackState = false
                player.setFrame("gothic-hero-jump5.png");
            });
        }
    }
    player.body.setSize();
}


function hitGround()
{
    player.custom_onGround = true;
}


/*
function attackEnemy()
{
    if(player.custom_attackState)
    {
        player.body.setSize();
        if(player.custom_Direction === "right" && (block.x > player.x) && !block.custom_isHit)
        {
            block.custom_health = block.custom_health - player.custom_currentWeapon.damage;
            console.log("Block Health: "+block.custom_health);
            block.custom_isHit = true;
        }
        else if(player.custom_Direction === "left" && (block.x < player.x) && !block.custom_isHit)
        {
            block.custom_health = block.custom_health - player.custom_currentWeapon.damage;
            console.log("Block Health: "+block.custom_health);
            block.custom_isHit = true;
        }
        if(block.custom_health === 0)
        {
            block.disableBody(true,true);
        }
        player.on('animationcomplete', function()
        {
            block.custom_isHit = false
        });
    }
    if(!player.custom_onGround)
    {
        player.custom_onGround = true;
    }
} */



function transitionToEnd()
{
    backgroundmusic.pause();
    this.scene.start("endscreen");
}