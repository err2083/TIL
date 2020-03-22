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
}
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
}
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

    
    