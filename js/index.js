const [w, h, tr, td] = [20, 20, 32, 32];
let snake;

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

    }
}
//初始化蛇
Snake.prototype.init = function () {
    //蛇头
    const snakeHead = new Cube(2, 0, 'snakeHead');
    snakeHead.create();
    //蛇身
    const snakeBody1 = new Cube(1, 0, 'snakeBody');
    snakeBody1.create();
    //蛇尾
    const snakeFoot = new Cube(0, 0, 'snakeBody');
    snakeFoot.create();
}
snake = new Snake();
snake.init();