// phina.js ���O���[�o���̈�ɓW�J
phina.globalize();

//�A�Z�b�g
var ASSETS = {
  image: {
     map: 'https://rawgit.com/shioleap/tomapiko-action/master/assets/map.png',
     chiaotzu: 'https://i.imgur.com/GfapwLa.png',
     ten: 'https://i.imgur.com/0ZWrzH8.png',
     napa: 'https://i.imgur.com/yUhJBHy.png',
     napa2: 'https://i.imgur.com/CR1xxDT.png',
     napa3: 'https://i.imgur.com/t8asDrF.png',
     napa4: 'https://i.imgur.com/ieUGEJU.png',
     chiaotzu_bullet:' https://i.imgur.com/KvisS15.png',
     bg: 'https://i.imgur.com/8ioMgMn.png'
  },
  sound: {
    'bgm': 'https://rawgit.com/alkn203/phina_js_tips/master/assets/sounds/bgm_maoudamashii_8bit25.mp3',
    'bgmDodo': 'https://rawgit.com/alkn203/phina_js_tips/master/assets/sounds/se_maoudamashii_chime14.mp3',
  },
};

var SCREEN_WIDTH  = 640;
var SCREEN_HEIGHT = 960;
var CHIAOTZU_TOP = 800;
var chiaotzu; //�`���I�Y
var napaNum = 6; // enemy�̐�
var napaNum2 = 5; // enemy�̐�
var napaNum3 = 3; // enemy�̐�
var napaNum4= 1; // enemy�̐�
var point = 0;
var timeLimit = 20; // ��������
var time;

// MainScene �N���X���`
phina.define('MainScene', {
  // DisplayScene�N���X���p��
  superClass: 'DisplayScene',
  // �R���X�g���N�^
  init: function() {
    // �e�N���X������
    this.superInit();
    // BGM
    SoundManager.playMusic('bgm');
    // �w�i
    Sprite('bg').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    // �|�C���g�\�����x��
    point = 0
    this.label_point = Label({text: '', fontSize: 30, fill: '#FFFFFF',}).addChildTo(this).setPosition(400,25);
    // �c�莞�ԕ\��
    time = 0;
    this.label_time = Label({text: '',fontSize: 30,fill: '#FFFFFF',}).addChildTo(this).setPosition(100,25);
    // �`���I�Y��ǉ�
    chiaotzu = Chiaotzu().addChildTo(this);
    // �h�h���p�O���[�v�쐬
    this.bulletGroup = DisplayElement().addChildTo(this);
    // �V�Ôт�ǉ�
    this.tenGroup = DisplayElement().addChildTo(this);
    Ten(0,300,8).addChildTo(this.tenGroup);
    Ten(0,500,3).addChildTo(this.tenGroup);
    // �G�O���[�v(�i�b�p)�쐬
    this.enemyGroup = DisplayElement().addChildTo(this);
    for(let i = 1;i <= napaNum;i++){
       this.generateNapa(100*i,600,'napa',100,-3);
    }
    for(let i = 1;i <= napaNum2;i++){
       this.generateNapa(150*i,400,'napa2',200,-6);
    }
    for(let i = 1;i <= napaNum3;i++){
       this.generateNapa(200*i,200,'napa3',300,-9);
    }
        for(let i = 1;i <= napaNum4;i++){
       this.generateNapa(250*i,50,'napa4',1000,-20);
    }
  },
  
  // �G��������
  generateNapa: function(player_x,player_y,level,point,moveSpeed) {
    Napa(player_x,player_y,level,point,moveSpeed).addChildTo(this.enemyGroup);
  },
  
  // �i�b�p�ƃr�[���̓����蔻��
  hitNapaBullet: function() {
    var self = this;
    // �G�����[�v
    this.enemyGroup.children.each(function(enemy) {
      self.bulletGroup.children.each(function(bullet) {
        // ����p�̉~
        var c1 = Circle(enemy.x,enemy.y,40);
        var c3 = Circle(bullet.x,bullet.y,20); 
        // �~����
        if (Collision.testCircleCircle(c1,c3)) {
          var enemyPoint = enemy.point;
          //SoundManager.play('se1');
          bullet.remove();
          enemy.remove();
          point += enemyPoint;
        }
      });
    });
  },
  
  // �V�Ôтƃr�[���̓����蔻��
  hitTenBullet: function() {
    var self = this;
    this.tenGroup.children.each(function(ten) {
    self.bulletGroup.children.each(function(bullet) {
        var c1 = Circle(ten.x,ten.y,40);
        var c3 = Circle(bullet.x,bullet.y,20);
               // �~����
        if (Collision.testCircleCircle(c1,c3)) {
          //SoundManager.play('bgmTen');
          bullet.remove();
          ten.remove();
          point -= 10000;
        }
    });
  });
  },
  
  //update���̏���
  update: function(app) {
    
    // time�J�E���g
    time += app.deltaTime;
    var timed = Math.floor(time / 1000);
    timeCount = timeLimit - timed;
    this.label_time.text = '�c�莞�ԁF' + timeCount;
    
    // �h�h���p�̓����蔻��
    this.hitNapaBullet();
    this.hitTenBullet();
    
    // �ړ�����
    this.enemyGroup.children.each(function(enemy) {
      //enemy.rotation -= 1;
      if(enemy.level==='napa'){
        if(enemy.x < 0){
          enemy.x =600;
        }
      }
      if(enemy.x < 0){
        enemy.x =600;
      }
    });
    
    this.tenGroup.children.each(function(ten) {
    //ten.x += 5;
    if(ten.x > 600){
      ten.x =0;
    }
    });
    
    // �|�C���g�X�V
    this.label_point.text = point;
    
    var self = this;
    if(timeCount <= 0){
      if(point > 2500){
        self.exit('result',{score:point,message:'�e������������Ă���Ă��肪�Ƃ��I�I'});
      } else if(point > 0){
        self.exit('result',{score:point,message:'�܂��܂��C�Ƃ�����Ȃ��ȁI�I'});
      } else if(point < 0) {
        self.exit('result',{score:point,message:'�e��������E���Ă񂶂�˂���I�I'});
      } else  {
        self.exit('result',{score:point,message:'���C����̂���I�I'});
      }
    }
    
  },
  
  // �^�b�`���肪true�̎��Ƀ^�b�`���ꂽ����s����鏈��
  onpointstart: function(e) {
    //SoundManager.play('bgmDodo');
    Bullet().addChildTo(this.bulletGroup).setPosition(chiaotzu.x,chiaotzu.y);
  },
  
  // �^�b�`���肪true�̎��Ƀ^�b�`����I������Ƃ��Ɏ��s����鏈��
  onpointend: function() {
  }
  
});


//�`���I�Y�N���X���`
phina.define('Chiaotzu', {
  //Sprite�N���X���p��
  superClass: 'Sprite',
  //�R���X�g���N�^
  init: function() {
    //�e�N���X������
    this.superInit('chiaotzu', 64, 64);
    // �^�b�`�\�ɂ���
    this.setInteractive(true); 
    //�ʒu���Z�b�g
    this.setPosition(SCREEN_WIDTH / 6,SCREEN_HEIGHT / 6);
    //y���W�̊�_����ԏ��
    this.setOrigin(0.5, 0);
    //���E���]
    this.scaleX = -1;
  },
  
  //update���̏���
  update: function(app) {
    
    //�@�ړ�����
    var p = app.pointer;
    this.x = p.x;
    this.y = p.y;
    
    // ��ʊO�͂ݏo������
    if (this.left < 0) {
      this.left = 0;
      this.physical.velocity.x *= -1;
      
    }else if (this.right > SCREEN_WIDTH) {
      this.right = SCREEN_WIDTH;
      this.physical.velocity.x *= -1;
    }
    
    if (this.top < CHIAOTZU_TOP) {
      this.top = CHIAOTZU_TOP;
      this.physical.velocity.y *= -1;
      
    }else if (this.bottom > SCREEN_HEIGHT) {
      this.bottom = SCREEN_HEIGHT;
      this.physical.velocity.y *= -1;
    }
    
  }
  
  
});

// �`���I�Y�r�[���N���X
phina.define('Bullet',{
  
  superClass: 'Sprite',
  init:function(player_x,player_y){
    this.superInit('chiaotzu_bullet',30,30);
    this.physical.velocity.y = -12;
  },
  
  //update���̏���
  update: function(){
    if (this.top < 0) {
      this.remove();
    }
  }
  
});

//�V�ÔуN���X���`
phina.define('Ten', {
  //Sprite�N���X���p��
  superClass: 'Sprite',
  //�R���X�g���N�^
  init: function(setPositionX, setPositionY,moveSpeed) {
    //�e�N���X������
    this.superInit('ten', 64, 64);
    //�ʒu���Z�b�g
    this.setPosition(setPositionX, setPositionY);
    //y���W�̊�_����ԏ��
    this.setOrigin(0.5, 0);
    //���E���]
    this.scaleX = -1;
    // �ړ����������X�s�[�h
    this.physical.velocity.x = moveSpeed;
  },
  
  //update���̏���
  update: function(app) {
  }
  
  
});

//�i�b�p�N���X���`
phina.define('Napa', {
  
  //Sprite�N���X���p��
  superClass: 'Sprite',
      //�R���X�g���N�^
      init: function(setPositionX, setPositionY,level,point,moveSpeed) {
      //�e�N���X������
      this.superInit(level, 90, 90);
      //�ʒu���Z�b�g(X,Y)
      this.setPosition(setPositionX, setPositionY);
      //y���W�̊�_����ԏ��
      this.setOrigin(0.5, 0);
      this.point = point;
      this.physical.velocity.x = moveSpeed;
      this.level = level;
    },
  
    //update���̏���
    update: function(app) {
    
    }
  
});


// ���C������
phina.main(function() {
  
  // �A�v���P�[�V��������
  var app = GameApp({
    title: '�V���񎀂ȂȂ���',
    // ���C���V�[������J�n����
    startLabel: location.search.substr(1).toObject().scene || 'title', 
    width: SCREEN_WIDTH,     // �X�N���[���̉���
    height: SCREEN_HEIGHT,   // �X�N���[���̏c��
    backgroundColor: '#444', // �X�N���[���̔w�i�F
    autoPause: true,         // �����|�[�Y�����邩
    debug: false,            // �f�o�b�O���[�h�ɂ��邩
    fps: 30,                 // 1�b�Ԃɉ�ʂ��X�V�����
    assets: ASSETS,          //�A�Z�b�g
  });
  
  // �A�v���P�[�V�������s
  app.run();
});
