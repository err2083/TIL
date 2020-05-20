***이 글은 자바스크립트 닌자 비급을 참고해서 쓴 글입니다.***
# 1. 객체 지향과 프로토타입
## 1.0 개요
    자바스크립트에서 프로토타입은 객체의 프로퍼티를 정의하고, 객체의 인스턴스에 자동으로
    적용되는 기능을 정의하는 편리한 수단이다. 프로토타입에 프로퍼티를 정의하면, 인스턴스 객체
    또한 그 프로퍼티를 갖게 된다.

## 1.1 인스턴스 생성과 프로토타입
    모든 함수에는 prototype 프로퍼티가 있고, 이 prototype 프로퍼티는 처음에는 빈 객체를 참조한다.
    만약 함수를 생성자로 사용하지 않는다면 이는 그다지 쓸모없다.
    먼저 객체 인스턴스 생성을 살펴보자
    new 연산자를 사용하는 경우와 그렇지 않은 두가지 간단한 코드를 살펴보자
```javascript
function Star() {}

Star.prototype.light = function() {
    return true;
}

var sun = Star();
var lunar = new Star();

console.log(sun); // undefined
console.log(lunar); // Star
console.log(lunar.light()); // true
```
    코드를 보면 먼저 아무일도 안하는 빈 함수를 선언하고 이 함수의 prototype에 메서드를 추가한다.
    그리고 일반 호출 형태와 생성자로 호출한후 반환값을 출력해본다.
    일반적인 호출 형태는 반환값이 없으므로 undefined 가 나오지만
    new 연산자를 함수는 새로운 객체가 생성되고 이 객체가 함수의 콘텍스트로 설정된다.
    그리고 이 인스턴스는 앞서 선언한 prototype 프로퍼티에 light 메서드가 
    존재하는것을 확인할 수 있다. 이는 함수의 프로토타입이 새로운 객체 생성을 위한
    일종의 청사진 역활을 하며, 생성자 함수의 prototype 프로퍼티에 메서드를 추가하면
    새로 만들어진 객체에 덧붙여지는것을 알 수 있다.
    그럼 인스턴스 메서드가 있다면 우선순위는 어떻게 될까?
    코드를 살펴보자
```javascript
function Star() {
    this.sun = false;
    this.light = function(){
        return !this.sun;
    };
}

Star.prototype.light = function() {
    return this.sun;
}

var lunar = new Star();
console.log(lunar.light()); // true
```
    코드를 통해 프로토타입 메서드와 인스턴스 메서드가 동일한 이름이지만
    콘솔의 결과는 인스턴스 메서드를 따라가는것을 확인할수 있다.
    즉, 객체를 생성자로 만들어진 인스턴스의 초기화 순서는
    1. 프로토타입의 프로퍼티들이 새로 만들어진 객체 인스턴스와 바인딩한다.
    2. 생성자 함수 내에서 정의한 프로퍼티들이 객체 인스턴스에 추가된다.
    로 확인할 수 있다.
    그런데 앞선 예제를 보면 함수를 생성자 함수로 호출할때 프로토타입이 지닌
    프로퍼티가 새로운 객체에 복사되는것처럼 보인다.
    그럼 다음 코드를 한번 살펴보자
```javascript
function Star(){
    this.light = true;
}

var sun = new Star();

Star.prototype.lunar = function(){
    return this.light;
}

console.log(sun.lunar()); // true
```
    만일 프로토타입이 지닌 프로퍼티가 생성 시점에 복사된다면 생성 이후에
    프로토타입에 정의한 프로퍼티를 참조할수 없을것이지만
    코드를 보면 문제없이 동작하는것을 확인할 수 있다.
    실제로 객체의 어떤 프로퍼티를 참조할 때 해당 객체가 그 프로퍼티를 직접
    소유한 게 아니라면, 프로토타입에서 그 프로퍼티를 찾는다.
    이 모든것이 어떻게 동작할까?
    변수는 객체를 가리키며 객체는 constructor 프로퍼티를 통해 생성자 함수와
    연결되고, 생성자 함수는 prototype 프로퍼티를 통해 프로토타입 객체를 가리킨다.
    constructor 라는 프로퍼티는 자바스크립트 모든 객체에 암묵적으로 존재하며,
    이 프로퍼티는 그 객체를 만드는 데 사용한 생성자를 참조한다.
    그리고 프로토타입은 생성자의 프로퍼티이기 때문에 모든 객체는 자신의 프로토타입을
    찾을수 있다.
    위 코드에서 다음 코드를 실행해보면 생성자 함수와 프로토타입 프로퍼티를 확인할 수 있다.
```javascript
console.log(sun.constructor);
console.log(sun.constructor.prototype.lunar);
```
    이는 객체가 만들어진 이후에 프로토타입에 변경한 프로퍼티에 객체가 접근할수 있는지를
    알수 있는 부분이다.
    그럼 인스턴스 메서드가 존재할때 같은 이름의 프로토타입 메서드를 정의하면 어떻게 될까?
    인스턴스에서 프로퍼티에 참조할때 직접적으로 가지고 있지 않을때면 프로토타입 프로퍼티를
    참조하므로 인스턴스 메서드가 우선하는것을 잊지 말자.
    
    자바스크립트는 언제 프로토타입을 사용하는지 알아두어야 하지만, 어떤 함수가
    객체 인스턴스를 생성했는지 아는것도 유용하다.
    객체의 생성자는 constructor 프로퍼티를 통헤 얻을 수 있다.
````javascript
function Star() {}
var star = new Star();
console.log(typeof star == "object"); // true
console.log(star instanceof Star); // true
console.log(star.constructor == Star); // true
````
    코드를 보면 객체 인스턴스 타입을 확인하고 있다.
    첫번째 방법인 typeof 는 인스턴스 객체에 대해 항상 'object' 를 반환하므로
    많은 정보를 얻지 못한다.
    보다 흥미로운 두번째는 어떤 생성자 함수를 사용하여 인스턴스를 만들었는지
    확인할수 있다. 하지만 
    세번째 방법은 인스턴스가 어디로부터 왔는지 역으로 참조하기 때문에
    원본 생성자 함수를 직접 접근하지 않더라도 인스턴스를 만들수 있다.
```javascript
function Star() {}
var star = new Star();
var star2 = new star.constructor();
```
    앞에서 본 instanceof 연산자를 살펴보자
    이는 객체 상속과 관련하여 또 다른 유용한 기능을 제공하는데. 먼저
    상속과 프로토타입 체인을 이해하여야 한다.
```javascript
function Star() {};
Star.prototype.tear = function() {};

function Light() {};
Light.prototype = { tear: Star.prototype.tear};

var light = new Light();
console.log(light instanceof Light); // true
console.log(light instanceof Star); // false
console.log(light instanceof Object); // true
```
    함수의 프로토타입도 객체이기 때문에, 상속 효과를 내도록 Star 프로토타입의
    메서드인 tear 프로퍼티를 Light 프로토타입에 복사함으로써 상속을 구현한다.
    그러나 light instanceof Star 는 실패하는 것이 이는 상속이 아닌 단지
    복사하는 점을 알수 있다.
    여기서 필요한것은 프로토타입 체인으로, 이를 이용해서 상속을 구현할수 있다.
    프로토타입 체인을 생성하는 제일 좋은 방법은 상위 객체의 인스턴스를 하위 객체의
    프로토타입으로 사용하는 것이다.
    SubClass.prototype = new SuperClass();
    subClass 인스턴스의 프로토타입은 SuperClass 의 인스턴스 이고,
    SuperClass 의 인스턴스는 SuperClass 의 프로토타입을 갖고 있으며
    SuperClass 의 프로토타입은 SuperClass 의 모든 프로퍼티가 있다.
    이런식으로 하위 클래스의 프로토타입은 상위 클래스의 인스턴스를 가리킨다.
```javascript
function Star() {}
Star.prototype.tear = function() {};
function Light() {}
Light.prototype = new Star();
var light = new Light();

console.log(light instanceof Light); // true
console.log(light instanceof Star); // true
console.log(light instanceof Object); // true
console.log(typeof light.tear == 'function'); // true 
```
    코드를 보면 instanceof 연산을 수행하면 함수가 자신의 프로토타입 체인
    내에 있는 어떤 객체의 기능을 상속하고 있는지를 확인 할수 있다.
    참고로 Star.prototype = Light.prototype 같은 방법은 지양하는 형태이다
    이는 Star 프로토타입에 일어나는 모든 변경사항이 Light 프로토타입에도 적용
    되므로 예상치못한 부작용을 초래할 수 있다.
    
    이를 응용하면 네이티브 객체(Array, String ..) 의 기능을 확장 할 수도 있다.
```javascript
if(!Array.prototype.forEach){
    Array.prototype.forEach = function(callback, context) {
        for (var i = 0; i < this.length; i++) {
            callback.call(context || null, this[i], i, this);
        }
    }
}
```
    모든 내장 객체에도 프로토타입이 있기 때문이 위 코드와 같이 확장을 할수있다.
    그러나 내장 객체 프로토타입은 언제나 하나이기 때문에 충동일 날 가능성이
    있으니 위험하다는 것을 인지하여야 한다.
    또 모든 DOM 엘리먼트가 HTMLElement 생성자를 상속한다는 것.
    우리는 HTMLElement 프로토타입에 접근할수 있고, HTML 노드도
    선택에 따라 확장 할 수있다.
```javascript
HTMLElement.prototype.remove = function(){
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
}

document.getElementById("a").remove();
```
    