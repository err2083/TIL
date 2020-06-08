***이 글은 You Don't Know JS을 참고해서 쓴 글입니다.***
# 1. 작동 위임
## 1.1 위임 지향 디자인으로 가는 길
    [[Prototype]]의 사용 방법을 가장 쉽게 이해하려면 먼저 [[Prototype]]이 클래스와는 근본부터 다른
    디자인 패턴이라는 사실을 인지해야한다.

### 1.1.1 클래스 이론
    소프트웨어 모델링이 필요한 3개의 유사한 Task가 있다고 하자. 클래스 기반의 디자인 설계 과정은
    가장 일반적인 부모 클래스와 유사한 Task의 공동 작동을 정의하고 Task를 상속받은 2개의 자식 클래스
    를 정의한 후 이들에 특화된 작동을 두 클래스에 각각 추가한다.
    클래스 디자인 패턴에서는 상속의 진가를 발휘하기 위해, 메서드를 오버라이드할 것을 권장하고 작동
    추가 뿐만 아니라 오버라이드 이전 원본 메서드를 super 키워드로 호출할 수 있게 지원한다.
    공통 요소는 추상화하여 부모 클래스의 일반 메서드로 구현하고 자식 클래스는 이를 더 세분화하여 쓴다.
    이제 하나 또는 그 이상 자식 클래스의 사본을 인스턴스화 하고 이 인스턴스에는 원하는 작동이 모두
    복사되어 옮겨진 상태로, 오직 인스턴스와 상호 작용한다.
    
### 1.1.2 위임 이론
    같은 문제를 작동 위임을 이용하여 생각해보자. 먼저 Task 객체를 정의하는데, 이 객체에는 다양한
    Task 에서 사용할 유틸리티 메서드가 포함된 구체적인 작동이 기술된다. Task 객체를 정의하여 고유한
    데이터와 작동을 정의하고 Task 유틸리티 객체에 연결해 필요할 때 특정 객체가 위임하도록 작성하자.
    기본적으로 XYZ 태스크 하나를 실행하려면 형제, 동료 객체로 부터 작동을 가져온다고 생각하자.
    이는 각자 별개의 객체로 분리된 상태에서 필요할 때마다 XYZ 객체가 tASK 객체에 작동을 위임하는 구조다.
```javascript
var Task = {
    setID: function(ID) {
        this.id = ID;
    },
    outputID: function() {
        console.log(this.id);
    }
};
var XYZ = Object.create(Task);
XYZ.prepareTask = function(ID, Label) {
    this.setID(ID);
    this.label = Label;
};
XYZ.outputTaskDetails = function() {
    this.outputID();
    console.log(this.label);
};
```
    예쩨에서 Task와 XYZ는 클래스나 함수도 아닌 그냥 객체이다.
    XYZ는 Object.create() 메서드로 Task 객체에 [[Prototype]] 위임을 했다.
    클래스 지향과 대비하여 이런 스타일 코드를 OLOO(Objects Linked to Other Objects)라 부른다.
    XYZ 객체가 Task 객체에 작동을 위임하는 부분만 신경 쓰면 된다.
    OLOO 스타일 코드의 특징으 다음과 같다.
    1. 예제 코드에서 id 와 label 두 데이터 멤버는 XYZ의 직속 프로퍼티다. 일반적으로
    [[Prototype]] 위임 시 상태값은 위임하는 쪽에 두고 위임받는 쪽에는 두지 않는다.
    2. 클래스 디자인 패턴에서는 부모/자식 양쪽에 메서드 이름을 똑같게 오버라이드 했다.
    작동 위임 패턴은 정반대다. 서로 다른 수준의 [[Prototype]] 연쇄에서 같은 명칭이 뒤섞이는 일은
    가능한 피해야 한다. 작동 위임 패턴에서는 일반적인 메서드 명칭보다 각 객체의 작동 방식을 잘 설명
    하는 명칭이 필요하다.
    3. this.setID(ID) 는 일단 XYZ 객체 내부에서 setID() 를 찾지만 XYZ에는 이 메서드가 존재하지
    않으므로 [[Prototype]] 위임 링크가 체결된 Task로 이동하여 setID()를 발견한다. 그리고 암시적
    호출부에 따른 this 바인딩 규직에 따라 Task에서 발견한 메서드지만 setID() 실행 시 this는 XYZ로
    바인딩 된다.
    
    작동 위임이란 찾으려는 프로퍼티/메서드 래퍼런스가 객체에 없으면 다른 객체로 수색 작업을 위임하는
    것을 의미한다. 이는 상속 이라는 수직적인 클래스 다이어그램이 아닌 객체들이 수평적으로 배열된
    상태에서 위임 링크가 체결된 모습을 떠올리자.
    
    복수의 객체가 양방향으로 상호 위임을 하면 발생하는 사이클은 허용되지 않는다.
    즉, [B -> A] 로 링크된 상태에서 [A > B] 로 링크하려고 시도하면 에러가 난다.
    
### 1.1.3 멘탈 모델 비교
    클래스와 위임 두 디자인 패턴을 멘탈 모델에 기반하여 어떤 의미를 가지는즈 살펴보자
    다음은 고전적인 프로토타입 스타일이다
```javascript
function Foo(who) {
    this.me = who;
};
Foo.prototype.identify = function() {
    return 'i am ' + this.me;
};

function Bar(who) {
    Foo.call(this, who);
};
Bar.prototype = Object.create(Foo.prototype);
Bar.prototype.speak = function() {
    alert('Hello, '+ this.identify() + '.');
};

var b1 = new Bar('b1');
var b2 = new Bar('b2');
b1.speak(); // Hello, i am b1.
b2.speak(); // Hello, i am b2.
```
    자식 클래스 Bar는 부모 클래스 Foo를 상속한 뒤 b1과 b2로 인스턴스화 한다. 그 결과 b1은
    Bar.prototype으로 위임되며 이는 다시 Foo.prototype으로 위임된다.
    
    다음은 OLOO 스타일이다
```javascript
var Foo = {
    init: function(who) {
        this.me = who;
    },
    identify: function() {
        return 'I am ' + this.me;
    }
};

var Bar = Object.create(Foo);
Bar.speak = function() {
    alert('Hello, ' + this.identify() + '.');
};

var b1 = Object.create(Bar);
b1.init('b1');
var b2 = Object.create(Bar);
b2.init('b2');

b1.speak(); // Hello, I am b1.
b2.speak(); // Hello, I am b2.
```
    앞에서 [b1 -> Bar.prototype -> Foo.prototype] 방향으로 위임한 것처럼 여기서도
    [b1 -> Bar -> Foo] 로 [[Prototype]] 위임을 활용하며, 세 객체는 서로 단단히 연결되어 있다.
    여기서 중요한 점은 생성자, 프로토타입, new 호출등 클래스처럼 보이게하려고 만든 장치들 없이
    객체를 서로 연결해주기만 했다는 점이다.
    
    그럼 두 코드에 관한 멘탈 모델을 살펴보자
    todo 이미지 넣기
![name](./path)

## 1.2 클래스 vs 객체
    이 절에서는 좀 더 구체적인 코드를 보자. 먼저 프런트엔드 웹 개발에서 가장 빈번한 위젯을 보자

### 1.2.1 위젯 클래스
    객체 지향 디자인 패턴에 오랫동안 길든 사람들은 위젯 말만 들어도 모든 위젯 작동의 공통 기반이
    될 부모 클래스와 유형마다 다른 위젯을 나타내는 자식 클래스를 머리속에 떠올릴 것이다.
```javascript
// 부모 클래스
function Widget(width, geight) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
}

Widget.prototype.render = function($where) {
    if (this.$elem) {
        this.$elem.css({
            width: this.width + 'px',
            height: this. this.height + 'px'
        }).appendTo($where);
    }  
};

// 자식 클래스
function Button(width, height, label) {
    // 'super' 생성자 호출
    Widget.call(this, width, height);
    this.label = label || "Default";
    this.$elem = $('<button>').text(this.label);
}

// 'Button'은 'Widget'으로부터 상속받는다
Button.prototype = Object.create(Widget.prototype);

// '상속받은' render() fmf 오버라이드 한다.
Button.prototype.render = function($where) {
    // 'super' 호출
    Widget.prototype.render.call(this, $where);
    this.$elem.click(this.onClick.bind(this));
};

Button.prototype.onClick = function(evt) {
    console.log(this.label + '버튼이 클릭됨!');
};
$(document).ready(function() {
   var $body = $(document.body);
   var btn1 = new Button(125, 30, 'Hello');
   var btn2 = new Button(150, 40, 'World');
   
   btn1.render($body);
   btn2.render($body);
});
```
    객체 지향 디자인 패턴에 따르면 부모 클래스에는 기본 render() 만 선언해두고 자식 클래스가
    이를 오버라이드 하도록 유도한다. 기본 기능을 버튼에만 해당하는 작동을 덧붙여 기본 기능을 증강한다.
    앞선 코드를 ES6 class 간편 구문으로 구현해보자
```javascript
class Widget {
    constructor(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    }
    render($where) {
        if (this.$elem) {
            this.$elem.css({
                width: this.width + 'px',
                height: this.height + 'px'
            }).append($where);
        }  
    }
}

class Button extends Widget {
    constructor(width, height, label) {
        super(width, height);
        this.label = label || "Default";
        this.$elem = $('<button>').text(this.label);
    }
    render($where) {
        super($where);
        this.$elem.click(this.onClick.bind(this));
    }
    onClick(evt) {
        console.log(this.label + '버튼이 클릭됨!');
    }
}
$(document).ready(function() {
   var $body = $(document.body);
   var btn1 = new Button(125, 30, 'Hello');
   var btn2 = new Button(150, 40, 'World');
   
   btn1.render($body);
   btn2.render($body);
});
```
    이전 코드랑 비교하면 상당히 매끄러워졌는데 특히 super() 가 있다는 점이 훌륭해 보인다.
    다음은 OLOO 스타일의 위임 코드이다
```javascript
var Widget = {
    init: function(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    },
    insert: function($where) {
        if (this.$elem) {
                this.$elem.css({
                width: this.width + 'px',
                height: this.height + 'px'
            }).append($where);
        }
    }
};

var Button = Object.create(Widget);
Button.setup = function(width, height, label) {
    // 위임 호출
    this.init(width, height);
    this.label = label || 'Default';
    this.$elem = $('<button>').text(this.label);
};
Button.build = function($where) {
    // 위임 호출
    this.insert($where);
    this.$elem.click(this.onClick.bind(this));
};
Button.onClick = function(evt) {
    console.log(this.label + ' 버튼이 클릭됨!');
};

$(document).ready(function() {
   var $body = $(document.body);
   var btn1 = new Button(125, 30, 'Hello');
   var btn2 = new Button(150, 40, 'World');
   
   btn1.render($body);
   btn2.render($body);
});
```
    OLOO 관점에서는 Widget이 부모도 Button 이 자식도 아니다. Widget은 보통 객체로
    갖가지 유형의 위젯이 위임히여 사용할 수 있는 유틸리티 창고 역할을 맡는다.
    디자인 패턴관점에서 클래스 방식이 고집하는 같은 이름의 render() 메서드를 공유할 필요가
    없다. 대신 각자 수행하는 임무를 더욱 구체적으로 드러낼 다른 이름을 부여한다.
    
## 1.3 더 간단한 디자인