const [w, h, tr, td] = [20, 20, 32, 32];
let snake = null;
let game = null;
let foodxy = [];
//方块
function Cube(x, y, classname) {
    this.x = x * w;
    this.y = y * h;
    this.class = classname;
    this.viewContent = document.createElement('div');
    this.viewContent.className = this.class;
    this.parent = document.getElementById('content');
}

Cube.prototype.create = function () {
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.width = w + 'px';
    this.viewContent.style.height = h + 'px';
    this.viewContent.style.top = this.y + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.parent.appendChild(this.viewContent);
}

Cube.prototype.remove = function () {
    this.parent.removeChild(this.viewContent);
}
//创建蛇
function Snake() {
    this.head = null;
    this.foot = null;
    this.body = [];
    this.direction = {
        up: {
            x: 0,
            y: -1,
            rotate: -90
        },
        down: {
            x: 0,
            y: 1,
            rotate: 90
        },
        left: {
            x: -1,
            y: 0,
            rotate: 180
        },
        right: {
            x: 1,
            y: 0,
            rotate: 0
        }
    }
}
//初始化蛇
Snake.prototype.init = function () {
    //蛇头
    const snakeHead = new Cube(2, 0, 'snakeHead');
    snakeHead.create();
    this.head = snakeHead;
    this.body.push([2, 0]);
    //蛇身
    const snakeBody1 = new Cube(1, 0, 'snakeBody');
    snakeBody1.create();
    this.body.push([1, 0]);
    //蛇尾
    const snakeFoot = new Cube(0, 0, 'snakeBody');
    snakeFoot.create();
    this.foot = snakeFoot;
    this.body.push([0, 0]);
    //形成链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;
    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeFoot;
    snakeFoot.last = snakeBody1;
    snakeFoot.next = null;
    //蛇默认方向为右
    this.snakedirection = this.direction.right;
}
//判断下一位置
Snake.prototype.getnext = function () {
    let nexthead = [
        this.head.x / 20 + this.snakedirection.x, this.head.y / 20 + this.snakedirection.y
    ]
    //撞到自己
    this.body.forEach(function (s) {
        if (s[0] == nexthead[0] && s[1] == nexthead[1]) {
            console.log("撞到自己");
            snake.nextTodo.over();
            return;
        }
    })
    //撞墙
    if (nexthead[0] > 31 || nexthead[0] < 0 || nexthead[1] > 31 || nexthead[1] < 0) {
        console.log("撞墙了");
        this.nextTodo.over();
        return;
    }
    //撞到食物
    if (nexthead[0] == foodxy[0] && nexthead[1] == foodxy[1]) {
        this.nextTodo.eat.call(this);
    }
    //什么都没撞到，走
    this.nextTodo.move.call(this);//改变this指向
}
//处理下一位置后要做的事
Snake.prototype.nextTodo = {
    //走
    move: function (add) {
        let newbody = new Cube(this.head.x / 20, this.head.y / 20, 'snakeBody');//创建身体方块
        //更新链表关系

        newbody.next = this.head.next;
        newbody.next.last = newbody;
        newbody.last = null;

        newbody.create();
        this.head.remove();
        this.body.splice(0, 1, [newbody.x / 20, newbody.y / 20]);

        let newhead = new Cube(this.head.x / 20 + this.snakedirection.x, this.head.y / 20 + this.snakedirection.y, 'snakeHead');//创建头方块
        //更新链表关系
        newhead.next = newbody;
        newhead.last = null;
        newbody.last = newhead;
        newhead.viewContent.style.transform = 'rotate(' + this.snakedirection.rotate + 'deg)';
        newhead.create();
        this.body.unshift([newhead.x / 20, newhead.y / 20]);//添加到数组首位
        this.head = newhead;//更新head
        if (!add) {
            this.foot.remove();
            this.body.pop();//删除数组尾部
            // this.foot = new Cube(this.body[this.body.length - 1][0], this.body[this.body.length - 1][1], 'snakeBody');//更新foot
            this.foot = this.foot.last;
        }
    },
    //吃
    eat: function () {
        this.nextTodo.move.call(this, true);
        createfood();
        game.score++;
    },
    //结束
    over: function () {
        clearInterval(game.timer);
        alert('你的得分为：' + game.score);
        startbtn.style.display = 'block';
    }
}



//创建食物
function createfood() {
    let include = false;
    let x = Math.round(Math.random() * 31);
    let y = Math.round(Math.random() * 31);
    let newfood = new Cube(x, y, "food");
    snake.body.forEach(function (b) {
        if (b[0] == x && b(1) == y) {
            include = ture;
        }
    })
    if (!include) {
        var foodDom = document.querySelector('.food');
        if (foodDom) {
            foodDom.style.top = y * 20 + 'px';
            foodDom.style.left = x * 20 + 'px';
        }
        else {
            newfood.create();
        }
    }
    foodxy = [x, y];
}

function Game() {
    this.timer = null;
    this.score = 0;
}
Game.prototype.init = function () {

    snake.init();
    // snake.getnext();
    createfood();

    document.onkeydown = function (e) {
        if (e.which == 37 && snake.snakedirection != snake.direction.right) {
            snake.snakedirection = snake.direction.left;
        }
        else if (e.which == 38 && snake.snakedirection != snake.direction.down) {
            snake.snakedirection = snake.direction.up;
        }
        else if (e.which == 39 && snake.snakedirection != snake.direction.left) {
            snake.snakedirection = snake.direction.right;
        }
        else if (e.which == 40 && snake.snakedirection != snake.direction.up) {
            snake.snakedirection = snake.direction.down;
        }
    }
    this.start();
}
Game.prototype.pause = function () {
    clearInterval(game.timer);
}
Game.prototype.start = function () {
    this.timer = setInterval(() => {
        snake.getnext();
    }, 200);
}
game = new Game();
snake = new Snake();
//开始游戏
let startbtn = document.getElementById('startbtn');
let contentDiv = document.getElementById('content');
startbtn.onclick = function (e) {
    e.stopPropagation();
    contentDiv.innerHTML = '';
    game = new Game();
    snake = new Snake();
    startbtn.style.display = 'none';
    game.init();

    //暂停
    let boxClick = document.getElementById('boxClick');
    let pausebtn = document.getElementById('pausebtn');
    boxClick.addEventListener('click', function (e) {
        game.pause();
        pausebtn.style.display = 'block';
    })
    //继续
    pausebtn.onclick = function (e) {
        e.stopPropagation();
        game.start();
        pausebtn.style.display = 'none';
    }
}
