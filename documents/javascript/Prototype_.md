***이 글은 You Don't Know JS을 참고해서 쓴 글입니다.***
# 1. 프로토타입
## 1.1 [[Prototype]]
    명세에 따르면 자바스크립트 객체는 [[Prototype]]이라는 내부 프로퍼티가 있고, 다른 객체를 참조하는
    단순 래퍼런스로 사용한다. 거의 모든 객체가 이 프로퍼티에 null 아닌 값이 생성된 시점에 할당된다.
    myObject.a 처럼 객체 프로퍼티 참조시 [[Get]]은 기본적으로 객체 자체에 프로퍼티가 존재하는지 찾아보고
    존재하면 그 프로퍼티를 사용하는데, 프로퍼티가 없다면 다음 관심사가 이 객체의 [[Prototype]] 링크다.
```javascript
var anotherObject = {
    a: 2
};
// anotherObject 에 연결된 객체를 생성한다.
var myObejct = Object.create(anotherObject);

console.log(myObejct.a); // 2
```
    myObject는 anotherObject 와 [[Prototype]]이 링크됬다. 분명 myObject 에는 a 라는 프로퍼티가
    없지만 anotherObject에서 2라는 값을 대신 찾아 프로퍼티 접근의 결과값으로 반환한다.
    일치하는 프로퍼티명이 나올 때까지 아니면 [[Prototype]] 연쇄가 끝날 때까지 같은 과정이 반복된다.

## 1.1.1 Object.prototype
    [[Prototype]] 연쇄가 끝나는 지점은 내장 프로터타입 Object.prototype 에서 끝난다. 모든
    자바스크립트 객체는 Object.prototype 객체의 자손이므로 Object.prototype에는 자바스크립트
    에서 두루 쓰이는 다수의 공용 유틸리티가 포함되어 있다. (toString(), valueOf() 등등)

## 1.1.2 프로퍼티 세팅과 가려짐
    객체 프로퍼티 세팅은 단지 어떤 객체에 프로퍼티를 새로 추가하거나 기존 프로퍼티 값을 바꾸는 것
    이상의 의미가 있다. 다음 코드를 자세히 살펴보자 
```javascript
myObject.foo = "bar";
```
    foo 라는 이름의 평범한 데이터 접근 프로퍼티가 myObject 객체에 직속된 경우 이 할당문은
    단순히 기존 프로퍼티 값을 고치는 단순한 기능을 할 뿐이다.
    foo가 myObject에 직속된 프로퍼티가 아니면 [[Get]] 처럼 [[Prototype]] 연쇄를 순회하기 시작하고,
    그래도 foo가 발견되지 않으면 foo라는 프로퍼티를 myObject 객체에 추가한 후 주어진 값을 할당한다.
    foo가 [[Prototype]]의 상위 연쇄 어딘가에 존재하면 미묘한 일들이 벌어진다.
    foo라는 프로퍼티명이 myObject 객체와 이 객체를 기점으로 한 [[Prototype]] 연쇄의 상위 수준
    두 곳에서 동시에 발견될 때 이를 가려짐 이라 한다. myObject에 직속한 foo 때문에 상위 연쇄의 foo가
    가려지는 것이다. 이는 myObjcet.foo로 검색하면 언제나 연쇄의 최하위 수준에서 가장 먼저 foo 프로퍼티를
    찾기 때문이다.
    myObject에 직속한 foo는 없으나 myObject [[Prototype]] 연쇄의 상위 수준에 foo가 있을 때
    세가지 경우의 수가 따른다.
    1. [[Prototype]] 연쇄의 상위 수준에서 foo라는 이름의 일반 데이터 접근 프로퍼티가 존재하는데,
    읽기 전용이 아닐경우(writable:true) myObject의 직속 프로퍼티 foo가 새로 추가되어 가려짐 현상이 발생한다.
    2. [[Prototype]] 연쇄 상위 수준에서 foo가 읽기 전용(writable:false) 이면 조용히 무시되고,
    엄격모드에서는 에러가 발생한다. 어쨌든 겨라짐 현상은 발생하지 않는다.
    3. [[Prototype]] 연쇄 상위 단계에서 발견된 foo가 세터일 경우 항상 이 세터가 호출된다.
    즉, 가려짐 현상은 1번 경우에만 해당하는 얘기이다.
    여기서 주의할점은 2번 경우인데, [[Prototype]] 연쇄의 하위 수준에서 암시적으로 생성되지
    못하게 차단한다. 단지 쓰기 금지된 foo가 다른 객체에 있다는 이유만으로 봉쇄하는거는 다소 억지스럽다.
    가려짐은 그 이용 가치에 비해 애매한 구석이 있으니 사용하지 말자.(Delegation 파트 참고)
    더욱이 가려짐은 미묘하게 암시적으로 발생하는 경우도 있으니 주의해야 한다. 다음 코드를 보자
```javascript
var anoterObject = {
    a: 2
};
var myObject = Object.create(anoterObject);
console.log(myObject.hasOwnProperty('a')); // false

myObject.a++;

console.log(anoterObject.a); // 2
console.log(myObject.a); // 3

console.log(myObject.hasOwnProperty('a')); // true
```
    겉보기에는 myObject.a++가 anotherObject.a 프로퍼티를 찾아 1을 증가할거 같지만
    ++ 연산자는 결국 myObject.a = myObject.a + 1 을 의미한다. 따라서 [[Prototype]]을 경유하여
    [[Get]]을 먼저 찾고 anotherObject.a 에서 현재 값 2를 얻은 후 1을 증가하여 결과값 3을 얻고,
    [[Put]]으로 myObject에 가려짐 프로퍼티 a를 생성한 뒤 할당한다.
    그러므로 위임을 통해 프로퍼티를 수정할 땐 조심해야 한다.
    
## 1.2 클래스
    

    