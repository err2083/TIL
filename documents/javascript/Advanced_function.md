***이 글은 자바스크립트 닌자 비급을 참고해서 쓴 글입니다.***
# 1. 함수를 자유자재로 휘두르기
## 1.0 개요
    함수들을 이용해서 웹 어플리케이션을 작성할때 만나는 다양한 문제에 대한 해결법을 알아보자
    
## 1.1 익명함수
    익명 함수는 함수를 변수에 저장하거나, 어떤 객체의 메서드로 설정하기 위해 또는
    콜백으로 활용하는 것과 같이 나중에 사용하기 위한 함수를 만들 때 주로 사용한다.
    앞서 말한 상황은 나중에 함수를 참조하기 위한 용도로 함수 이름을 가질 필요가 없다.
    다음 코드는 익명 함수를 사용하는 일반적인 예제 이다.
```javascript
window.onload = function(){/**/}

var star = {
    light: function() {/**/}
}
star.light();

setTimeout(function(){/**/}, 500);
```
    첫번째 load 이벤트에 함수를 핸들러로 등록했다. 이 함수는 우리가 직접 호출하는것이 아니라
    이벤트 핸들링 메커니즘이 이 함수를 호출하므로 이름을 가질 필요가 없다,
    두번째 객체의 프로퍼티일 경우 함수의 이름이 아닌 프로퍼티 로 호출하므로 이름이 필요가 없다.
    마지막으로 타이머가 만료될때 호출하도록 setTimeout() 함수에 콜백으로 전달한다. 이 역시
    우리가 호출하지 않으므로 이름이 필요가 없다.
    
## 1.2 재귀
    재귀는 함수가 스스로를 호출하거나, 함수 내에서 다른 함수를 호출하는 과정에서
    원래 호출된 함수가 호출될때 일어난다. 간단한 형태의 재귀부터 천천히 알아보자
    
### 1.2.1 이름을 가진 함수 내에서의 재귀
    재귀의 일반적인 예로 팰린드롬 테스트가 있는데, 이는 문자열을 바로 읽으나 거꾸로 읽으나
    같은 문구인지를 확인하는 것이다.
    이를 수학적으로 정의하면,
    1. 문자가 1개 또는 0개인 문자열은 팰린드롬이다. - 기저 베이스
    2. 첫문자와 마지막 부분이 같고 나머지 부분이 팰린드롬인 문자열은 팰린드림 이다. - 더 작은 문제
    이를 구현 하면 다음과 같다
```javascript
function isPalindrome(text){
    if(text.length <= 1) return true;
    if(text.charAt(0) != text.charAt(text.length - 1)) return false;
    return isPalindrome(text.substr(1,text.length - 2));
}
```
    코드를 보면 isPalindrome 함수가 내부에서 자기자신을 호출하므로 재귀라고 할 수 있다.

### 1.2.1 메서드를 이용한 재귀
    이번엔 재귀 함수를 객체의 메서드로 선언해보자
```javascript
var star = {
    light: function(n){
        return n > 1 ? star.light(n-1) + '-chirp' : 'chirp';
    }
};
console.info(star.light(3) === 'chirp-chirp-chirp'); //true
```
    함수 내부에서 객체의 프로퍼티를 가리키는 참조를 사용해서 재귀적으로 호출한다.
    하지만 함수의 실제이름으로 호출할때와는 달리 참조는 변할수 있다.
    다음 코드와 같이 참조가 변하게 되면 재귀 함수는 동작하지 않는다
```javascript
var star = {
    light: function(n){
        return n > 1 ? star.light(n-1) + '-chirp' : 'chirp';
    }
};

var night = { luna: star.light };
star = {};

try{
    console.info(night.light(3) === 'chirp-chirp-chirp'); //error 
} catch (e) {
  console.info(e);
};
```
    여기서 문제는 재귀 함수가 여러곳에서 참조되는데, 자신이 호출될때
    호출한 객체의 메서드인지 상관없이 star.light 를 호출하는점에 있다.
    결국 메서드를 이용한 함수 호출은 익명 함수이기에 명시적으로 객체를 참조하는 대신,
    함수의 콘텍스트인 this를 사용해야 한다.
    함수를 메서드로써 호출하면 함수의 콘텍스트는 메서드가 호출된 객체를 가리킨다는것을 기억하자.
    하지만 여전히 문제가 있다. 만일 프로퍼티의 이름이 light 가 아니거나
    함수 light 가 객체의 프로퍼티가 아닐경우 문제가 된다.
    결국 함수에 이름이 필요하게 된다. 이를 인라인 함수(이름이 있는 익명함수) 라고하는데
    다음 코드와 같이 재귀 함수를 프로퍼티로 설정할수 있다.
```javascript
var star = {
    light: function night(n){
        return n > 1 ? night(n-1) + '-chirp' : 'chirp'; 
    }
};
```
    이 방법 말도고 arguments 매개변수의 callee 프로퍼티라는 함수를 이용하는 방법도 있다.
    (callee 프로퍼티는 ES5 부터 엄격 모드에서 사용이 금지됨)
    다음 코드를 보자
```javascript
var star = {
    light: function(n) {
        return n > 1 ? arguments.callee(n-1) + '-chirp' ? 'chirp';
    }
};
```
    arguments 매개변수는 callee 라는 프로퍼티를 가지고 있는데,
    이는 현재 실행 중인 함수를 가리킨다.
    
### 1.3 함수 객체 가지고 놀기
    자바스크립트 함수는 1종 객체로 프로퍼티를 추가할수 있다.
    이 점을 이용해서 서로 다르지만 연관성을 지닌 함수들을 저장하고 싶을때
    함수의 프로퍼티를 활용하면 컬렉션에 넣어서 일일이 비교하는 고지식한 방법이 아닌
    세련된 방법으로 구현할수 있다.
```javascript
var store = {
    nextId: 1,
    cache: {},
    add: function(fn){
        if (!fn.id){
            fn.id = store.nextId++;
            return !!(store.cache[fn.id] = fn); // !!는 Boolean 객체로 만드는 방법
        }
    }
};
```
    뿐만 아니라 함수의 프로퍼티를 활용해서 함수가 수행한 연산의 결과를 저장할 수도 있다.
    즉, 같은 연산을 수행하는 시간을 절약할 수 있다.
    이를 메모이제이션이라 하는데, 예시를 통해 알아보자
    먼저 복잡하게 소수를 만드는 코드를 작성해보자
```javascript
function isPrime(value){
    if(!isPrime.answers) isPrime.answers = {};
    if(isPrime.answers[value]) return isPrime.answers[value];
    var prime = value != 1;
    for (var i = 2; i < value; i++){
        if (value % i == 0) {
            prime = false;
            break;
        }
    }
    return isPrime.answers[value] = prime;
};
```
    이 코드를 보면 사용자가 함수를 사용했을때 넘긴 매개변수가 이미 캐시에 존재한다면
    연산없이 반환하지만 없다면 비용이 드는 연산을 실행할 것이다.
    이것이 메모이제이션으로 사용자는 이전에 연산된 값을 요청할때 성능 향상을 얻을수 있고,
    사용자는 메모이제이션에 대한 별로 작업이 필요없이 동작한다는 것이다.
    대신 메모리 사용량이 늘어난다는 점과, 함수 자체의 성능 테스트를 하기 힘들다는 단점도 있다.
    유사한 다른 예를 보자
```javascript
function getElements(name){
    if(!getElements.cache) getElements.cache = {};
    return getElements.cache[name] = getElements.cache[name] 
    || document.getElementsByTagName(name);
};
```
    이는 태그 명으로 DOM 엘리먼트 집합을 검색하는것을 메모이제이션으로 활용한 방식이다.
    이처럼 함수의 프로퍼티를 이용하면 상태와 캐시 정보를 외부에 노출하지 않는 단일 장소에 보관할수 있다.
    
    때때로 컬렉션을 멤버로 갖는 객체가 필요할 때가 있다. 컬렉션에 대한 메타 데이터를 같이
    저장하는 경우가 이에 해당한다. 한가지 방법은 새로운 버전의 객체가 필요할 때마다
    새로운 배열을 만들고 메타 데이터와 관련된 프로퍼티오아 메서드를 추가하는 것이다.
```javascript
var elems = {
    length: 0,
    add: function(elem){
        Array.prototype.add.call(this,elem);
    },
    gather: function(id){
        this.add(document.getElementById(id));
    }
};
```

    
    