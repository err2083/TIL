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
    
    