var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
function preload() {
    game.load.image('bg', 'assets/image/background.png');
    game.load.image('lava', 'assets/image/lava.png');
    game.load.image('test', 'assets/image/test.png');
    game.load.image('health', 'assets/image/health.png');
    game.load.image('hborder', 'assets/image/healthborder.png');
    //game.load.image('doorwin', 'assets/image/doorwin.png');
    game.load.spritesheet('girl', 'assets/sprite/player.png', 64, 65);
    game.load.spritesheet('enemy', 'assets/sprite/enemy.png', 128, 128);
    game.load.spritesheet('boss', 'assets/sprite/boss.png', 200, 200);
    game.load.tilemap('maptest', 'assets/tile/maptest.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', 'assets/tile/tileset.png');
    game.load.audio('bgm', 'assets/sound/bgm.mp3');
    game.load.audio('hit', 'assets/sound/swordnew.mp3');
    game.load.audio('scream', 'assets/sound/monster.mp3');
    game.load.audio('winbgm', 'assets/sound/epicwin.mp3');
    game.load.audio('losebgm', 'assets/sound/epiclose.mp3');
}
var losebgm;
var winbgm;
var bgm;
var hitsfx;
var monstersfx;
var lava;
var map;
var layer;
var player;
var puppet1;
var puppet2;
var puppet3;
var puppet4;
var enemytimer1;
var enemytimer2;
var enemytimer3;
var enemytimer4;
var hp1 = 100;
var hp2 = 100;
var hp3 = 100;
var hp4 = 100;
var boss;
var bosstimer;
var bosshp = 100;
var enemy;
var stage;
var cursors; // -jay
var jumpButton;
var attackButton;
var facing = 'left';
var jumpTimer = 0;
var playerdie;
var retryButton;
//hhealth
var score = 0;
var textscore;
var texthealth;
var health = 100;
var healthbar;
var hborder;
//gameover
var textgameover;
var textwin;
var EnemyPuppet = function (index, game, x, y) {
    this.enemy = game.add.sprite(x, y, 'enemy');
    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 0);
    this.enemy.body.velocity.x = 50;
    //walk
    this.enemy.animations.add('walkleft', [0, 1], 3, true);
    this.enemy.animations.add('walkright', [2, 3], 3, true);
    //attack
    this.enemy.animations.add('attackleft', [4, 5, 6, 7, 8, 9, 10], 5, true);
    this.enemy.animations.add('attackright', [11, 12, 13, 14, 15, 16, 17], 5, true);
    //die
    this.enemy.animations.add('dieleft', [18, 19, 20, 21, 22, 23], 5, false);
    this.enemy.animations.add('dieright', [24, 25, 26, 27, 28, 29], 5, false);
};
function create() {
    bgm = game.add.audio('bgm');
    winbgm = game.add.audio('winbgm');
    losebgm = game.add.audio('losebgm');
    bgm.play();
    hitsfx = game.add.audio('hit');
    monstersfx = game.add.audio('scream');
    monstersfx.volume = 70;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1920, 1920);
    game.physics.arcade.gravity.y = 500;
    stage = game.add.tileSprite(0, 0, 800, 600, 'bg');
    stage.fixedToCamera = true;
    lava = game.add.tileSprite(0, 1500, 1700, 200, 'lava');
    map = game.add.tilemap('maptest');
    map.addTilesetImage('tileset', 'tileset');
    layer = map.createLayer('testground');
    layer.resizeWorld();
    map.setCollisionByExclusion([167]);
    //add player into the game and the position
    //enemy = game.add.sprite(150, 550, 'enemy');
    puppet1 = new EnemyPuppet(0, game, 2300, 500);
    puppet2 = new EnemyPuppet(0, game, 300, 100);
    puppet3 = new EnemyPuppet(0, game, 530, 400);
    puppet4 = new EnemyPuppet(0, game, 1800, 400);
    boss = game.add.sprite(500, 1100, 'boss');
    player = game.add.sprite(50, 600, 'girl');
    game.physics.enable(lava, Phaser.Physics.ARCADE);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    game.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.allowGravity = false;
    boss.body.velocity.x = 200;
    boss.body.bounce.setTo(1, 0);
    lava.body.setImmovable = true;
    lava.body.allowGravity = false;
    player.body.setSize(40, 64, 15, 0);
    player.body.collideWorldBounds = true;
    //game.physics.enable(enemy, Phaser.Physics.ARCADE);
    //enemy.body.collideWorldBounds = true;
    //enemy.body.bounce.setTo(1, 0);
    //enemy.body.velocity.x = 50;
    //timer1
    enemytimer1 = game.time.create(false);
    enemytimer1.loop(3000, enemyturn1, this);
    enemytimer1.start();
    //timer2
    enemytimer2 = game.time.create(false);
    enemytimer2.loop(3000, enemyturn2, this);
    enemytimer2.start();
    //timer3
    enemytimer3 = game.time.create(false);
    enemytimer3.loop(3000, enemyturn3, this);
    enemytimer3.start();
    //timer4
    enemytimer4 = game.time.create(false);
    enemytimer4.loop(3000, enemyturn4, this);
    enemytimer4.start();
    textgameover = game.add.text(250, 200, " GAMEOVER \n press r to retry", {
        font: "60px Impact",
        fill: "#ff0000",
        align: "center"
    });
    textgameover.fixedToCamera = true;
    textgameover.visible = false;
    textwin = game.add.text(250, 200, " YOU WIN ! ", {
        font: "60px Impact",
        fill: "#ffffff",
        align: "center"
    });
    textwin.fixedToCamera = true;
    textwin.visible = false;
    textscore = game.add.text(600, 20, " ", {
        font: "20px Arial",
        fill: "#FFFFFF",
        align: "left"
    });
    textscore.fixedToCamera = true;
    texthealth = game.add.text(400, 20, " ", {
        font: "14px Arial",
        fill: "#ff0044",
        align: "center"
    });
    texthealth.fixedToCamera = true;
    healthbar = game.add.sprite(20, 20, 'health');
    healthbar.fixedToCamera = true;
    hborder = game.add.sprite(15, 11, 'hborder');
    hborder.fixedToCamera = true;
    //ANIMATION
    //PLAYER
    //idle
    player.animations.add('idleleft', [0, 1, 2, 3], 5, true);
    player.animations.add('idleright', [4, 5, 6, 7], 5, true);
    //walk
    player.animations.add('walkleft', [8, 9, 10, 11], 5, true);
    player.animations.add('walkright', [12, 13, 14, 15], 5, true);
    //jump
    player.animations.add('jumpleft', [16], 5, false);
    player.animations.add('jumpright', [17], 5, false);
    //attack
    player.animations.add('attackleft', [18, 19, 20], 5, false);
    player.animations.add('attackright', [21, 22, 23], 5, false);
    //die
    player.animations.add('dieleft', [26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 5, false);
    player.animations.add('dieright', [36, 37, 38, 39, 40, 41, 42, 43, 44, 45], 5, false);
    boss.animations.add('die', [0, 1], 3, false);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    attackButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
    retryButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
    game.camera.follow(player);
}
//enemy turn1
function enemyturn1() {
    //enemy move right, change animation to moveright
    if (puppet1.enemy.body.velocity.x == 50) {
        puppet1.enemy.body.velocity.x = -50;
        puppet1.enemy.animations.play('walkleft');
    }
    else if (puppet1.enemy.body.velocity.x == -50) {
        puppet1.enemy.body.velocity.x = 50;
        puppet1.enemy.animations.play('walkright');
    }
    else if (puppet1.enemy.body.velocity.x == 0) {
        if (game.rnd.integerInRange(0, 1) == 0) {
            puppet1.enemy.body.velocity.x = 50;
            puppet1.enemy.animations.play('walkright');
        }
        else {
            puppet1.enemy.body.velocity.x = -50;
            puppet1.enemy.animations.play('walkleft');
        }
    }
}
//enemy turn2
function enemyturn2() {
    //enemy move right, change animation to moveright
    if (puppet2.enemy.body.velocity.x == 50) {
        puppet2.enemy.body.velocity.x = -50;
        puppet2.enemy.animations.play('walkleft');
    }
    else if (puppet2.enemy.body.velocity.x == -50) {
        puppet2.enemy.body.velocity.x = 50;
        puppet2.enemy.animations.play('walkright');
    }
    else if (puppet2.enemy.body.velocity.x == 0) {
        if (game.rnd.integerInRange(0, 1) == 0) {
            puppet2.enemy.body.velocity.x = 50;
            puppet2.enemy.animations.play('walkright');
        }
        else {
            puppet2.enemy.body.velocity.x = -50;
            puppet2.enemy.animations.play('walkleft');
        }
    }
}
//enemy turn3
function enemyturn3() {
    //enemy move right, change animation to moveright
    if (puppet3.enemy.body.velocity.x == 50) {
        puppet3.enemy.body.velocity.x = -50;
        puppet3.enemy.animations.play('walkleft');
    }
    else if (puppet3.enemy.body.velocity.x == -50) {
        puppet3.enemy.body.velocity.x = 50;
        puppet3.enemy.animations.play('walkright');
    }
    else if (puppet3.enemy.body.velocity.x == 0) {
        if (game.rnd.integerInRange(0, 1) == 0) {
            puppet3.enemy.body.velocity.x = 50;
            puppet3.enemy.animations.play('walkright');
        }
        else {
            puppet3.enemy.body.velocity.x = -50;
            puppet3.enemy.animations.play('walkleft');
        }
    }
}
//enemy turn4
function enemyturn4() {
    //enemy move right, change animation to moveright
    if (puppet4.enemy.body.velocity.x == 50) {
        puppet4.enemy.body.velocity.x = -50;
        puppet4.enemy.animations.play('walkleft');
    }
    else if (puppet4.enemy.body.velocity.x == -50) {
        puppet4.enemy.body.velocity.x = 50;
        puppet4.enemy.animations.play('walkright');
    }
    else if (puppet4.enemy.body.velocity.x == 0) {
        if (game.rnd.integerInRange(0, 1) == 0) {
            puppet4.enemy.body.velocity.x = 50;
            puppet4.enemy.animations.play('walkright');
        }
        else {
            puppet4.enemy.body.velocity.x = -50;
            puppet4.enemy.animations.play('walkleft');
        }
    }
}
function update() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(boss, layer);
    game.physics.arcade.overlap(player, lava, playerlava, null);
    game.physics.arcade.overlap(player, boss, playerboss, null);
    //collide enemy 1
    game.physics.arcade.collide(puppet1.enemy, layer);
    game.physics.arcade.overlap(puppet1.enemy, player, enemyattack1, null);
    //collide enemy 2
    game.physics.arcade.collide(puppet2.enemy, layer);
    game.physics.arcade.overlap(puppet2.enemy, player, enemyattack2, null);
    //collide enemy 3
    game.physics.arcade.collide(puppet3.enemy, layer);
    game.physics.arcade.overlap(puppet3.enemy, player, enemyattack3, null);
    //collide enemy 4
    game.physics.arcade.collide(puppet4.enemy, layer);
    game.physics.arcade.overlap(puppet4.enemy, player, enemyattack4, null);
    player.body.velocity.x = 0;
    if (retryButton.isDown) {
        bgm.stop();
        winbgm.stop;
        losebgm.stop();
        this.game.state.restart();
    }
    if (player.body.onFloor()) {
        if (cursors.left.isDown) {
            player.body.velocity.x = -200;
            player.animations.play('walkleft');
            facing = 'left';
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 200;
            player.animations.play('walkright');
            facing = 'right';
        }
        else if (player.body.velocity.x == 0 && attackButton.isUp && health != 0) {
            if (facing == 'right') {
                player.animations.play('idleright');
            }
            else if (facing == 'left') {
                player.animations.play('idleleft');
            }
        }
    }
    else {
        if (cursors.left.isDown) {
            player.body.velocity.x = -160;
            player.animations.play('jumpleft');
            facing = 'left';
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 160;
            player.animations.play('jumpright');
            facing = 'right';
        }
    }
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
        player.body.velocity.y = -400;
        jumpTimer = game.time.now + 750;
    }
    if (attackButton.isDown && player.body.velocity.x == 0) {
        if (facing == 'left') {
            player.animations.play('attackleft');
            if (!hitsfx.isPlaying) {
                hitsfx.play();
            }
        }
        else if (facing == 'right') {
            player.animations.play('attackright');
            if (!hitsfx.isPlaying) {
                hitsfx.play();
            }
        }
    }
    texthealth.setText(" " + bosshp + " ");
    textscore.setText("SCORE " + score + " ");
    //player dies
    if (health == 0) {
        textwin.visible = false;
        textgameover.visible = true;
        bgm.stop();
        winbgm.stop();
        if (!losebgm.isPlaying)
            losebgm.play();
        if (facing == 'left') {
            player.animations.play('dieleft');
            if (player.frame == 35) {
                player.destroy();
            }
        }
        else if (facing == 'right') {
            player.animations.play('dieright');
            if (player.frame == 45) {
                player.destroy();
            }
        }
    }
    //boss die
    if (bosshp == 0) {
        boss.animations.play('die');
        if (boss.frame == 0) {
            score = score + 34000;
            boss.destroy();
            textwin.visible = true;
            textgameover.visible = false;
            bgm.stop();
            losebgm.stop();
            winbgm.play();
        }
    }
    //puppet1 die
    if (hp1 == 0) {
        enemytimer1.stop();
        puppet1.enemy.animations.play('dieleft');
        if (puppet1.enemy.frame == 23) {
            puppet1.enemy.destroy();
            score = score + 1000;
        }
    }
    if (hp2 == 0) {
        enemytimer2.stop();
        puppet2.enemy.animations.play('dieleft');
        if (puppet2.enemy.frame == 23) {
            puppet2.enemy.destroy();
            score = score + 1000;
        }
    }
    if (hp3 == 0) {
        enemytimer3.stop();
        puppet3.enemy.animations.play('dieleft');
        if (puppet3.enemy.frame == 23) {
            puppet3.enemy.destroy();
            score = score + 1000;
        }
    }
    if (hp4 == 0) {
        enemytimer4.stop();
        puppet4.enemy.animations.play('dieleft');
        if (puppet4.enemy.frame == 23) {
            puppet4.enemy.destroy();
            score = score + 1000;
        }
    }
}
//enemy attack1
function enemyattack1() {
    if (player.frame == 19) {
        puppet1.enemy.frame = 31;
        if (hp1 >= 2) {
            hp1 = hp1 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    else if (player.frame == 22) {
        puppet1.enemy.frame = 30;
        if (hp1 >= 2) {
            hp1 = hp1 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    //check enemy moving what direction
    //if enemy is moving right
    if (puppet1.enemy.body.velocity.x == 50) {
        puppet1.enemy.body.velocity.x = 0;
        //perform 'attackright' animation
        puppet1.enemy.animations.play('attackright');
        if (puppet1.enemy.frame == 17) {
            puppet1.enemy.body.velocity.x = 50;
            puppet1.enemy.animations.play('walkright');
        }
    }
    else if (puppet1.enemy.body.velocity.x == -50) {
        //perform 'attackright' animation
        puppet1.enemy.animations.play('attackleft');
    }
    if (puppet1.enemy.frame == 10) {
        player.frame = 25;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
    else if (puppet1.enemy.frame == 17) {
        player.frame = 24;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
}
//enemy attack2
function enemyattack2() {
    if (player.frame == 19) {
        puppet2.enemy.frame = 31;
        if (hp2 >= 2) {
            hp2 = hp2 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    else if (player.frame == 22) {
        puppet2.enemy.frame = 30;
        if (hp2 >= 2) {
            hp2 = hp2 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    //check enemy moving what direction
    //if enemy is moving right
    if (puppet2.enemy.body.velocity.x == 50) {
        puppet2.enemy.body.velocity.x = 0;
        //perform 'attackright' animation
        puppet2.enemy.animations.play('attackright');
        if (puppet2.enemy.frame == 17) {
            puppet2.enemy.body.velocity.x = 50;
            puppet2.enemy.animations.play('walkright');
        }
    }
    else if (puppet2.enemy.body.velocity.x == -50) {
        //perform 'attackright' animation
        puppet2.enemy.animations.play('attackleft');
    }
    if (puppet2.enemy.frame == 10) {
        player.frame = 25;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
    else if (puppet2.enemy.frame == 17) {
        player.frame = 24;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
}
//enemy attack3
function enemyattack3() {
    if (player.frame == 19) {
        puppet3.enemy.frame = 31;
        if (hp3 >= 2) {
            hp3 = hp3 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    else if (player.frame == 22) {
        puppet3.enemy.frame = 30;
        if (hp3 >= 2) {
            hp3 = hp3 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    //check enemy moving what direction
    //if enemy is moving right
    if (puppet3.enemy.body.velocity.x == 50) {
        puppet3.enemy.body.velocity.x = 0;
        //perform 'attackright' animation
        puppet3.enemy.animations.play('attackright');
        if (puppet3.enemy.frame == 17) {
            puppet3.enemy.body.velocity.x = 50;
            puppet3.enemy.animations.play('walkright');
        }
    }
    else if (puppet3.enemy.body.velocity.x == -50) {
        //perform 'attackright' animation
        puppet3.enemy.animations.play('attackleft');
    }
    if (puppet3.enemy.frame == 10) {
        player.frame = 25;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
    else if (puppet3.enemy.frame == 17) {
        player.frame = 24;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
}
//enemy attack4
function enemyattack4() {
    if (player.frame == 19) {
        puppet4.enemy.frame = 31;
        if (hp4 >= 2) {
            hp4 = hp4 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    else if (player.frame == 22) {
        puppet4.enemy.frame = 30;
        if (hp4 >= 2) {
            hp4 = hp4 - 2;
        }
        if (!monstersfx.isPlaying)
            monstersfx.play();
    }
    //check enemy moving what direction
    //if enemy is moving right
    if (puppet4.enemy.body.velocity.x == 50) {
        puppet4.enemy.body.velocity.x = 0;
        //perform 'attackright' animation
        puppet4.enemy.animations.play('attackright');
        if (puppet4.enemy.frame == 17) {
            puppet4.enemy.body.velocity.x = 50;
            puppet4.enemy.animations.play('walkright');
        }
    }
    else if (puppet4.enemy.body.velocity.x == -50) {
        //perform 'attackright' animation
        puppet4.enemy.animations.play('attackleft');
    }
    if (puppet4.enemy.frame == 10) {
        player.frame = 25;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
    else if (puppet4.enemy.frame == 17) {
        player.frame = 24;
        if (health >= 2) {
            health = health - 2;
            healthbar.scale.x = health / 100;
        }
    }
}
function playerlava() {
    health = 0;
}
function playerboss() {
    if (player.frame == 19 || player.frame == 22) {
        if (bosshp >= 0.5) {
            bosshp = bosshp - 0.5;
        }
        boss.frame = 1;
    }
}
function render() {
    game.debug.cameraInfo(game.camera, 500, 32);
}
//# sourceMappingURL=app.js.map