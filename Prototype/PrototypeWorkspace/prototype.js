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
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let player;
let block;
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

function preload()
{
    this.load.atlas("hero", "/assets/Hero.png", "/assets/Hero.json");
    this.load.image("floor", "/assets/BrickPattern.png");
    this.load.image("ice", "/assets/icleblock.png");
}


function create()
{
    player = this.physics.add.sprite(20,550,"hero", "gothic-hero-idle1.png");
    player.setGravityY(160);
    player.custom_onGround = true;
    player.custom_Direction = "right";
    player.custom_attackState = false;
    player.custom_currentWeapon = weapons[currentWeapon];
    player.custom_currentArmor = armors[currentArmor];
    player.custom_baseHealth = 4;
    player.custom_hp = player.custom_baseHealth + player.custom_currentArmor.hearts;


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





    var floor1 = this.physics.add.sprite(400,650, "floor");
    var floor2 = this.physics.add.sprite(600, 500, "floor");
    floor2.setScale(0.1);
    floor2.setImmovable(true);
    floor1.setImmovable(true);

    block = this.physics.add.sprite(300,540, "ice");
    block.custom_health = 15;
    block.setImmovable(true);
    block.custom_isHit = false;
    block.setScale(0.5);
    this.input.keyboard.on("keydown-A", attackAction, this);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(floor1, player, hitGround, null, this);
    this.physics.add.collider(floor1, block);
    this.physics.add.collider(floor2, player, hitGround, null, this);
    this.physics.add.collider(block,player, attackBlock, null, this);
    

    console.log("Current armor: "+player.custom_currentArmor.key+"\tCurrent weapon: "+player.custom_currentWeapon.key);
}


function update()
{

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

}


function attackAction()
{
    if(!player.custom_attackState)
    {
        player.custom_attackState = true;
        player.setVelocityX(0);
        player.anims.play("attack");
        player.on('animationcomplete',function()
        {
            player.custom_attackState = false
        });
    }
    player.body.setSize();
}


function hitGround()
{
    player.custom_onGround = true;
}

function attackBlock()
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
}