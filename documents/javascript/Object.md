***이 글은 You Don't Know JS을 참고해서 쓴 글입니다.***
# 1. 객체
## 1.1 구문
    객체는 선언적 형식과 생성자 형식 두가지로 정의할수 있다.
```javascript
var Obj = {
    key: 'value'
};

var myObj = new Object();
myObj.key = 'value';
```
    두 혈식 모두 결과적으로 생성되는 객체는 같으나 리터럴 형식은 한번의 선언으로
    다수의 키/값 쌍을 프로퍼티에 선언할수 있다.
    생성자 형식으로 객체를 생성하는 형식은 상당히 드물기 때문에 주로 리터럴 형식으로 선언한다.

## 1.2 타입
    자바스크립트는 7개의 주요 타입을 가지고 있다.
    null, undefined, boolean, number, string, object, symbol
    여기서 null 부터 string 은 단순 원시 타입으로 객체가 아니다.
    반면 복합 원시 타입이라는 독특한 객체 하위 타입이 있는데,
    function 이 이에 속한다, 배열 역시 추가 기능이 구현된 객체의 일종이다.

### 1.2.1 내장 객체
    내장 객체라고 부르는 객체의 하위 타입이 있는데,
    String, Number, Boolean, Object, Function, Array, Date, RegExp, Error
    이 존재한다. 이는 주로 new 키워드를 사용되어 주어진 하위 타입의 새 객체를 생성한다.
```javascript
var strPrimitive = "i'm string";
typeof strPrimitive // string
strPrimitive instanceof String // false

var strObject =  new String("i'm String");
typeof strObject // object
strObject instanceof String // true
```
    여기서 i'm string 이라는 원시값은 객체가 아닌 원시 리터럴이며 불변값이다.
    만일 문자 개수를 세는 등 문자별로 접근할 때엔 String 객체가 필요하다.
    이런 상황에서 자바스크립트 엔진은 상황에 맞게 원시 값을 객체로 강제 변환하므로
    객체를 생성할 일은 거의 없다.
```javascript
var strPrimitive = "i'm stirng";
console.info(strPrimitive.length); // 10
console.info(strPrimitive.charAt(5)); // t
```
    코드를 보면 원시 리터럴인 strPrimitive를 String 객체로 강제 변환해주어서
    메서드 접근을 가능하도록 도와준다.
    반면 Date 값은 리터럴 형식이 없으므로 반드시 생성자 형식으로 생성해야 한다.
    또한 Object, Arrays, Functions, RegExps 는 형식(리터럴/생성자)과 무관하게
    모두 객체다.

## 1.3 내용
    객체는 특정한 위치에 저장된 모든 타입의 값, 즉 프로퍼티로 내용이 채워진다.
    실제로 객체 내부에 프로퍼티 값이 쌓이는것이 아니라 엔진에 따라 다르지만
    대체적으로 프로퍼티 값을 가리키는 포인터 역활을 하는 객체 컨테이너가 일반적이다.
    
### 1.3.1 배열
    배열은 [] 로 접근하는 형태이지만 객체보다 저장하는 방법과 장소가 더 체계적이다.
    배열은 숫자 인덱싱 이라는 양수로 표기된 위치에 저장한다.
    배열 자체는 객체이기도 하므로 프로퍼티를 추가하는것도 가능하지만,
    정해진 용도에 맞게 최적화되어 작동하므로 키/값 으로 배열을 사용하는것은
    좋은 생각은 아니다.
    또한 주의할점은 배열에 프로퍼티를 추가할때 프로퍼티명이 숫자와 유사하면
    숫자 인덱스로 잘못 해석되므로 조심하자
```javascript
var myArray = ['star', 'light', 'lunar'];
myArray['3'] = 'sun';
console.info(myArray.length); //4
console.info(myArray[3]); //sun
```

### 1.3.2 객체 복사
    다음 객체를 한번 보자
```javascript
function anotherFunction() {/**/}
var anotherObject = {
    c: true
};
var anotherArray = [];
var myObject = {
    a: 2,
    b: anotherObject,
    c: anotherArray,
    d: anotherFunction
};
anotherArray.push(anotherObject, myObject);
```
    여기서 myObject 를 복사한다면 어떻게 표현을 해야할까? 먼저 얕은 복사, 깊은 복사를
    선택해야한다. 얕은 복사를 하면 새 객체의 a 프로퍼티는 복사 되지만,
    b, c, d 는 원 객체의 래퍼런스와 같은 대상을 가리키는 또 다른 래퍼런스가 생성된다.
    이때 깊은 복사를 하면 모조리 복사되지만 위 코드의 경우 문제가 있다.
    anotherArray 가 anoterObject 와 myObject를 가리키는 래퍼런스를 가지고 있으므로
    순환 참조 형태가 되므로 무한 복사의 구렁텅이에 빠지고만다.
    이 난관에 대한 뾰족한 답은 없지만 대안으로 JSON 객체를 이용하는 법도 있다.
```javascript
var newObj = JSON.parse(JSON.stringify(someObj));
```
    얕은 복사는 별다른 이슈가 없기에 Object.assign() 메서드를 이용해서 복사하면 된다.
    assign() 메서드의 첫번째 인자는 타겟 객체, 두번째 이후로는 소스 객체가 된다.
    소스 객체의 열거 가능한것과 보유키를 순회하면서 타겟 객체로 복사한다.
    
### 1.3.3 프로퍼티 서술자
    ES5 부터 모든 프로퍼티는 프로퍼티 서술자로 표현이 된다. 다음 코드를 보자
```javascript
var myObject = {
    a: 2
};

Object.getOwnPropertyDescriptor(myObject, a);
//{
// value: 2,
// writable: true,
// enumerable: true,
// configurable: true
// }
```
    보다시피 평범한 객체 프로퍼티 a의 프로퍼티 서술자를 조회해보니
    값 말고도 3개지 특성이 더 있음을 확인할수 있다.
    Object.defineProperty() 로 새로운 프로퍼티를 추가하거나,
    기존 프로퍼티의 특성을 수정(configurable: true 일때) 할 수 있다.

#### 1.3.3.1 쓰기 가능
    프로퍼티 값의 쓰기 가능 여부를 writable 로 조정가능한데,
    만일 쓰기 금지된 값을 수정하려고하면 실패하고, 엄격모드에서는 에러가 발생한다.
```javascript
var myObject = {};
Object.defineProperty(myObject, "a", {
   value: 2,
   writable: false,
   configurable: true,
   enumerable: true 
});
myObject.a = 3;
console.info(myObject.a); //2
```
    
#### 1.3.3.2 설정 가능
    프로퍼티가 설정 가능하면 defineProperty() 로 프로퍼티 서술자를 변경할수 있다.
    다음 코드를 보자
```javascript
var myObject = {
    a: 2
};

Object.defineProperty(myObject, "a", {
    value: 3,
    enumerable: true,
    writable: true,
    configurable: false
});

console.info(myObject.a); //3

Object.defineProperty(myObject, "a", {
    value: 4,
    enumerable: true,
    writable: true,
    configurable: true
}); // TypeError
```
    설정 불가한 프로퍼티의 서술자를 변경하려고 하니 엄격보드와 상관없이 에러가 발생한다.
    일단 configurable 이 false 가 되면 돌아올수 있는 방법이 없어진다.
    미묘하지만 configurable 가 false 여도 writable 을 true 에서 false 로 변경할수 있는데,
    이 또한 false 로 변경되면 true 로 돌릴수 없다.
    추가로 configurable 이 false 이면 delete 로 지우려고 해도 실패하게 된다.
    
#### 1.3.3.3 열거 가능성
    이 속성은 for ... in 루프처럼 객체 프로퍼티를 열겨하는 구문에서
    해당 프로퍼티의 표출 여부를 나타낸다.
    enumerable: false 로 지정된 프로퍼티는 접근할수 있지만 루프 구문에서 감춰진다.
    
### 1.3.4 불변성
    프로퍼티/객체를 의도적으로 변경되지 않게 할 경우가 있다.
    이때 얕은 불변성을 지원해주는데, 객체 자신과 직속 프로퍼티 특성을
    불변으로 만들어주지만 다른 객체를 가리키는 레퍼런스의 내용까지 불변으로 만들지는 못한다.
    
    먼저 앞서 배운 프로퍼티 설정자를 이용해서 writable: false, configurable: false 로
    지정하면 상수처럼 쓸 수 있다.
    
    다음으로 객체에 더는 프로퍼티를 추가하지 못하도록 차단하고 싶을때
    Object.preventExtenstions() 를 호출한다.
```javascript
var myObject = {
    a: 2
};
Object.preventExtensions(myObject);
myObject.b = 3;
console.info(myObject.b); // undefined
```
    코드와 같이 프로퍼티를 추가해도 실패하고, 엄격모드에서는 TypeError 이 발생한다.
    
    다음으로는 기존의 프로퍼티를 추가하지 못하게 할 뿐더러, 기존 프로퍼티를 재설정하거나
    삭제할수 없게 하고 싶을때 Object.seal() 을 실행한다. 물론 값은 변경할수 있다.
    
    가장 높은 단계의 불변성으로 앞서 설면한 Object.seal() 을 적용한 후, 프로퍼티 모두를
    writable: false 처리하는 Object.freeze() 도 있다.
    물론 객체가 참조하는 다른 객체의 내용을 봉쇄하지는 못한다.
    