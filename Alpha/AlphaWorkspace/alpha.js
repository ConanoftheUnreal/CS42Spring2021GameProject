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







//player specific
let player;
let cursors;
let longsword = {
    key: "Long Sword",
    damage: 10,
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


//enemies
let boss;
let spiders;
let enemyGhosts;
let fireBalls;
let fireSkulls;



// music
let backgroundmusic;
let pain;
let swish;



let myWalkingLayer;
let ceilingWallLayer;
let wall1;
let wall2;

function Level5preload()
{
    this.load.atlas("hero", "/assets/sprites/Hero.png", "/assets/sprites/Hero.json");
    this.load.atlas("FireSkull", "/assets/sprites/FireSkull.png", "/assets/sprites/FireSkull.json");
    this.load.atlas("GhostEnemy", "/assets/sprites/GhostSpriteSheet.png", "/assets/sprites/GhostSpriteSheet.json");
    this.load.atlas("Spider", "/assets/sprites/spider.png", "/assets/sprites/spider.json");
    this.load.image("castleTiles","assets/TileMap/gothic-castle-fullTileset.png");
    this.load.tilemapTiledJSON("gothic-castle-map","assets/TileMap/CastleTileMap.json");
    this.load.audio("gothic-castle-backgroundMusic","assets/Music/ViktorKraus-IntotheRuins.ogg");
    this.load.audio("swish","assets/Music/swish-3.ogg");
    this.load.audio("pain","assets/Music/pain1.ogg");
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
    player.custom_dead = false;
    player.custom_immuneTimer = 0;


    //camera placement

    let mycamera = this.cameras.main;
    mycamera.startFollow(player);

    mycamera.setBounds(0,0,Map.widthInPixels, Map.heightInPixels);


    //hero animations
    this.anims.create(
        {
            key: "playeridle",
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
            key: "playerjump",
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
            key: "playerrun",
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
            key: "playerattack",
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
            key: "playerjumpAttack",
            frames: this.anims.generateFrameNames("hero", {
                prefix: "gothic-hero-jumpAttack",
                start:1,
                end: 4,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 8
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
        transitionToEndButton,
        this
    );

    //audio
    backgroundmusic = this.sound.add("gothic-castle-backgroundMusic");
    pain = this.sound.add("pain");
    swish = this.sound.add("swish");



    

    //ghost enemies

    enemyGhosts = this.physics.add.group();
    enemyGhosts.custom_defaultFrame = "ghost-appears1.png";

    this.anims.create(
        {
            key: "ghostAppear",
            frames: this.anims.generateFrameNames("GhostEnemy", {
                prefix: "ghost-appears",
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
            key: "ghostIdle",
            frames: this.anims.generateFrameNames("GhostEnemy", {
                prefix: "ghost-idle",
                start:1,
                end: 7,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );

    this.anims.create(
        {
            key: "ghostAttack",
            frames: this.anims.generateFrameNames("GhostEnemy", {
                prefix: "ghost-shriek",
                start:1,
                end: 4,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );

    this.anims.create(
        {
            key: "ghostVanish",
            frames: this.anims.generateFrameNames("GhostEnemy", {
                prefix: "ghost-vanish",
                start:1,
                end: 7,
                suffix:".png"
            }),
            repeat: 0,
            frameRate: 7
        }
    );





    enemyGhosts.create(400, 220, "GhostEnemy", enemyGhosts.custom_defaultFrame);
    enemyGhosts.create(1000, 220, "GhostEnemy", enemyGhosts.custom_defaultFrame);
    enemyGhosts.create(1990, 220, "GhostEnemy", enemyGhosts.custom_defaultFrame);






    enemyGhosts.children.iterate(
        function(en)
        {
            en.custom_state = "appear";
            en.custom_timer = 0;
            en.custom_originx = en.x;
            en.custom_originy = en.y;
            en.custom_id = "ghost";
            en.custom_hp = 20;
            en.setVisible(false);
            en.custom_facing = "left";
            en.custom_isHit = false;
        }
    );

    


    //fireballs
    
    fireBalls = this.physics.add.group();
    fireBalls.custom_defaultFrame = "fire1.png";

    this.anims.create(
        {
            key: "fireball",
            frames: this.anims.generateFrameNames("GhostEnemy", {
                prefix: "fire",
                start:1,
                end:2,
                suffix:".png"
            }),
            repeat: -1,
            frameRate: 4
        }
    );




    //spiders
    spiders = this.physics.add.group();
    spiders.custom_defaultFrame = "spider1.png";

    this.anims.create(
        {
            key:"spiderwalk",
            frames: this.anims.generateFrameNames("Spider",
            {
                prefix: "spider",
                start: 1,
                end: 4,
                suffix: ".png"
            }),
            repeat:-1,
            frameRate: 7
        }
    );


    spiders.create(1000, 485, "Spider", spiders.custom_defaultFrame);

    spiders.children.iterate(
        function(en)
        {
            en.custom_state = "walking";
            en.custom_timer = 0;
            en.custom_originx = en.x;
            en.custom_originy = en.y;
            en.custom_id = "spider";
            en.custom_facing = "left";
            en.custom_cycle = 0;
            en.custom_speed = 100;
        }
    );



    //collisions
    this.physics.add.collider(player, myWalkingLayer, hitGround, null, this);
    this.physics.add.overlap(player, fireBalls, playerHitFireball, null, this);
    this.physics.add.collider(player, ceilingWallLayer);
    this.physics.add.collider(player, wall1);
    this.physics.add.collider(player, wall2);
    this.physics.add.overlap(player, enemyGhosts, hitGhost, null, this);
    this.physics.add.overlap(player, spiders, hitSpider, null, this);


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
            player.play("playerrun",true);
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
            player.play("playerrun", true);
        }
        player.setVelocityX(160);
        player.body.setSize();
    }
    else if(!player.custom_attackState){
        if(player.custom_onGround)
        {
            player.play("playeridle", true);
        }
        player.setVelocityX(0);
        player.body.setSize();
    }

    if(cursors.up.isDown && player.custom_onGround && !player.custom_attackState)
    {
        player.custom_onGround = false;
        player.setVelocityY(-160);
        player.play("playerjump");
        player.body.setSize();
    }

    if((!player.custom_inBossRoom) && (player.x > 1160) && (player.y > 500))
    {
        wall1.enableBody(true, 1700, 510, true, true);
        wall2.enableBody(true, 1150, 510, true, true);
        player.custom_inBossRoom = true;
    }



    //Enemy Ghost actions
    
    enemyGhosts.children.iterate(
        function (en)
        {
            en.body.setSize();
            switch(en.custom_state)
            {
                case "appear":
                    var test = (player.x +400) >= en.x;
                    test = test && ((player.x-400) <= en.x);
                    test = test && ((player.y - 400) <= en.y );
                    test = test && ((player.y + 400) >= en.y);
                    if(test)
                    {
                        en.setVisible(true);
                        en.anims.play("ghostAppear");
                        en.custom_state = "idle";
                        en.custom_timer = 10*7;
                    }
                    break;
                case "idle":
                    var test = (player.x +200) >= en.x;
                    test = test && ((player.x-200) <= en.x);
                    test = test && ((player.y - 200) <= en.y );
                    test = test && ((player.y + 200) >= en.y);
                    if(en.custom_timer > 0)
                    {
                        if((player.x > en.x) && (en.custom_facing === "left"))
                        {
                            en.toggleFlipX();
                            en.custom_facing = "right";
                        }
                        else if ((player.x < en.x) && (en.custom_facing === "right"))
                        {
                            en.toggleFlipX();
                            en.custom_facing = "left";
                        }
                        en.custom_timer--;
                    }
                    else if (test)
                    {
                        en.custom_state = "attack";
                        en.custom_timer = 0;
                    }
                    else{
                        en.anims.play("ghostIdle");
                        en.custom_timer = 10*7;
                    }
                    break;
                case "attack":
                    en.custom_timer = 10*20;
                    en.custom_state = "idle";
                    en.anims.play("ghostAttack");
                    en.on("animationcomplete-ghostAttack", function()
                    {
                        if(en.custom_facing === "left")
                        {
                            fireBalls.create(en.x-5, en.y, "GhostEnemy", fireBalls.custom_defaultFrame).toggleFlipX().setVelocityX(-100).anims.play("fireball");
                        }else if( en.custom_facing === "right" )
                        {
                            fireBalls.create(en.x+5, en.y, "GhostEnemy", fireBalls.custom_defaultFrame).setVelocityX(100).anims.play("fireball");
                        }
                        en.anims.play("ghostIdle");
                    });
                    break;
                case "dead":
                    en.anims.play("ghostVanish", true);
                    en.on("animationcomplete-ghostVanish", function ()
                    {
                        en.destroy();
                    });
                    break;
            }
        }
    );



    //spider actions

    spiders.children.iterate(
        function (en)
        {
            if(en.custom_timer > 0)
            {
                en.custom_timer --;
            }
            else{
                en.custom_timer = 10*10;
                if(en.custom_cycle%2 === 0)
                {
                    en.setVelocityX(-en.custom_speed);
                    en.setFlipX(true);
                    en.custom_cycle = 0;
                }
                else{
                    en.setVelocityX(en.custom_speed);
                    en.setFlipX(false);
                }
                en.custom_cycle++;
            }
        }
    );



    // Player immuneframes
    if(player.custom_immuneTimer > 0)
    {
        if(player.custom_immuneTimer%5)
        {
            player.setVisible(false);
        }else{
            player.setVisible(true);
        }
        player.custom_immuneTimer--;
    }
    else if(player.custom_immuneTimer === 0)
    {
        player.setVisible(true);
    }
    player.body.setSize();

}


function attackAction()
{
    if(!player.custom_attackState)
    {
        if(player.custom_onGround){
            player.custom_attackState = true;
            player.setVelocityX(0);
            player.anims.play("playerattack");
            swish.play({volume: 0.4, rate: 0.5});
            player.on('animationcomplete',function()
            {
                player.custom_attackState = false;
            });
        }
        else{
            player.custom_attackState = true;
            player.anims.play("playerjumpAttack");
            swish.play({volume: 0.4, rate:0.5});
            player.on('animationcomplete',function()
            {
                player.custom_attackState = false;
                player.setFrame("gothic-hero-jump5.png");
            });
        }
    }
}


function hitGround()
{
    player.custom_onGround = true;
}

function playerHitFireball(player, fireball)
{
    if(player.custom_immuneTimer === 0)
    {
        player.custom_hp --;
        pain.play({volume: 0.4});
        console.log("Player HP: " + player.custom_hp);
    }
    fireball.destroy();
    let currentScene = this;
    playerDeadQ(currentScene);
}



function hitGhost(player, ghost)
{
    let currentScene = this;
    if(player.custom_attackState)
    {
        attackEnemy(player, ghost);
    }
    else{
        if(player.custom_immuneTimer === 0){
            pain.play({volume: 0.4});
            player.custom_hp--;
            player.custom_immuneTimer = 10*10;
            console.log("Player HP: " + player.custom_hp);
            playerDeadQ(currentScene);
        }
    }
}


function hitSpider(player, spider)
{
    let currentScene = this;
    if(player.custom_immuneTimer === 0){
        pain.play({volume: 0.4});
        player.custom_hp--;
        player.custom_immuneTimer = 10*10;
        console.log("Player HP: " + player.custom_hp);
        playerDeadQ(currentScene);
    }
}


function playerDeadQ(currentScene)
{
    if(player.custom_hp <= 0)
    {
        transitionToEnd(currentScene);
    }
}



function attackEnemy(player, enemy)
{
    if(player.custom_Direction === "right" && (enemy.x > player.x) && !enemy.custom_isHit)
    {
        enemy.custom_hp = enemy.custom_hp - player.custom_currentWeapon.damage;
        enemy.custom_isHit = true;
    }
    else if(player.custom_Direction === "left" && (enemy.x < player.x) && !enemy.custom_isHit)
    {
        enemy.custom_hp = enemy.custom_hp - player.custom_currentWeapon.damage;
        enemy.custom_isHit = true;
    }
    if(enemy.custom_hp <= 0)
    {
        enemy.custom_state = "dead";
        enemy.custom_timer = 10*7;
    }
    player.on('animationcomplete-playerattack', function()
    {
        enemy.custom_isHit = false
    });
}



function transitionToEndButton()
{
    backgroundmusic.pause();
    this.scene.start("endscreen");
}


function transitionToEnd(currentScene)
{
    backgroundmusic.pause();
    currentScene.scene.start("endscreen");
}