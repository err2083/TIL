***이 글은 자바스크립트 닌자 비급을 참고해서 쓴 글입니다.***
# 1. 클로저와 가까워지기
## 1.0 개요
    클로저는 자바스크립트의 특징적인 기능으로 함수와 긴밀한 관계를 가지고 있다.
    클로저를 활용하면 복잡한 연산도 단순하게 만들수 있으므로,
    어떻게 클로저를 통해 페이지 스크립트를 만드는지 살펴보자

## 1.1 클로저는 어떻게 동작하는가?
    클로저는 함수를 선언할 때 만들어지는 유효 범위다.
    함수는 클로저를 통해서 자신이 선언될 때 속해 있던 유효 범위 내의 변수와 함수를
    사용할 수 있고, 변수의 경우 그 값을 변경할 수도 있다.
    다음 코드를 분석해보자
```javascript
var outerValue = 'star';
var later;

function outerFunction(){
    var innerValue = 'light';
    
    function innerFunction(){
        console.log(outerValue);
        console.log(innerValue);
    }
    
    later = innerFunction;
}

outerFunction();

later(); //star, light
```
    여기서 later() 을 실행할때 결과가 어떻게 나올까?
    첫번째 outerValue는 전역 유효 범위에 있고, 모든 곳에서 볼 수 있다.
    innerValue의 경우 전역 변수인 later에 innerFunction의 참조를 복사한 이후
    outerFunction 가 실행한 이후에 later 를 실행한다. innerFunction 함수만 보면
    innerValue 의 유효 범위는 이미 사라진지 오래이다. 그러나 정상적으로 light 가 출력이된다.
    이것이 클로저 이다. innerFunction 클로저는 해당 함수가 존재하는 한, 함수의 유효 범위와
    관계된 모든 변수를 가비지 컬렉션으로부터 보호한다.
    즉, outerFunction 내에서 innerFunction 을 선언했을 때, 함수만 정의되는것이 아니라
    그 시점에 같은 유효 범위에 있는 모든 변수를 포함하는 클로저도 생성된다.
    코드를 보면 innerFunction 가 속해있던 유효 범위가 사라지고 난 후에 실행됬음에도
    원래 유효 범위에 접근할수 있게 된다.
    클로저는 함수가 동작하는 한 관련 정보를 유지하는 보호막을 만드는 개념이다.
    이전 예시를 좀더 확장해보자
```javascript
var outerValue = 'star';
var later;

function outerFunction(){
    var innerValue = 'light';
    
    function innerFunction(paramValue){
        console.log(outerValue);
        console.log(innerValue);
        console.log(paramValue);
        console.log(tooLate);
    }
    
    later = innerFunction;
}

var tooLate = 'sun';//(1)
outerFunction();
//(2)

later('lunar'); // star, night, lunar, sun
```
    코드를 보면 매개변수를 innerFunction 에 추가했고, outerFunction을 정의한 이후에
    변수를 추가로 선언했다. 이 코드를 통해 클로저의 알수있는점은
    첫째, 함수 매개변수는 함수의 클로저에 포함되어 있디.
    둘째, outerFunction 유효 범위에 속한 모든 변수뿐만 아니라 함수를 선언한 뒤에
    선언한 변수라도 모두 클로저에 포함된다.
    만일 (1) 의 위치를 (2) 로 변경한다면 어떻게 될까?
    
    클로저는 아쉽게도 명시적으로 정보를 보관하는 객체가 없어서 확인할수는 없지만
    이러한 방식으로 정보를 저장하고 참조하는 데는 직접적인 비용이 든다.
    즉, 클로저를 이용해서 정보에 접근하는 함수는 계속해서 관련된 정보를 지녀야하므로
    오버헤드를 가질수바께 없다. 즉, 클로저에 관련된 모든 정보가 더이상 사용하는 곳이
    없을때 까지 메모리에 남아있는다.
  
## 1.2 클로저 작업하기
    이제부터 클로저를 페이지 내에서 이용하는 방법을 알아보자
    
### 1.2.1 Private 변수
    클로저를 사용하는 일반적인 경우 중 하나는 private 변수처럼 몇몇 정보를 숨기고자 할때다.
    즉, 변수의 유효 범위를 제한하려는 용도로 사용할수 있다. 다음 코드를 보자
```javascript
function Star(){
    var lunar = 0;
    this.getLunar = function(){
        return lunar;
    }
    this.moon = function(){
        lunar++;
    }
}
var star = new Star();
star.moon();
console.log(star.getLunar()); //1
console.log(star.lunar); //undefined
```
    코드를 보면 Star함수 안에 변수 lunar를 선언한다. 이 변수의 유효범위는 함수 내부이므로
    private 변수가 된다. 생성자의 실행이 끝나면 변수를 포함하고 있는 유효 범위는 사라지지만
    moon 메서드를 선언함으로써 만들어지는 클로저 덕분에 lunar 변수를 참조하고 수정할수 있다.
    
### 1.2.2 콜백과 타이머
    클로저를 사용하는 다음 일반적인 상황은 콜백과 타이머이다.
    두 경우 모두 지정된 함수들이 임의의 시간 뒤에 비동기적으로 호출이 되는데,
    이때 함수 외부에 있는 데이터에 접근해야 하는 경우가 빈번하다.
    다음은 클로저를 이용한 콜백 코드를 살펴보자
```javascript
$('#Button').click(function(){
   var $el = $('#subject');
   $el.html('star');
   $.ajax({
    url: "url",
    success: function(rep){
        $el.html(rep);
    }
   });
});
```
    코드를 보면 ajax 인자 중에 익명 함수가 있는데 이 함수는 응답에 대한 콜백으로 사용된다.
    이 콜백이 클로저를 통해 $el 변수에 접근할 수 있는것이다.
    다음은 클로저를 이용한 타이머 코드이다,
```javascript
function animateIt(elementId){
    var el = document.getElementById(elementId);
    var tick = 0;
    
    var timer = setInterval(function(){
        if (tick < 100){
            el.style.left = el.style.top = tick + 'px';
            tick++;
        } else{
            clearInterval(timer);
            console.log(tick);
            console.log(timer);
        }
    }, 10);
};
```
    코드를 보면 애니메이션 프로세스를 정의하는 함수는
    DOM 참조변수, 단계 카운터, 타이머 참조 변수 세개를 지니고 있다.
    이 변수들은 애니메이션이 진행되는 동안 유지되어야 하면서, 전역으로 선언하면 안된다.
    잠깐, 왜 전역으로 선언하면 안되는것일까?
    만일 세 변수들이 전역으로 선언된 상태에서 두 개 이상의 엘리먼트들을 애니메이션 프로세스에
    실행하게 될 경우, 동일한 변수를 서로 다른 애니메이션이 접근하여 충돌이 일어나게 된다.
    즉, 변수를 전역 유효 범위에 둘 경우, 각 애니메이션 마다 3개의 변수가 필요하게 된다.
    결국 클로저를 통해서 해당 변수에 접근하므로써 각 애니메이션은 변수를 저장할 수 있는
    독립된 공간을 갖게 된다.
    클로저를 사용하지 않는다면 이벤트 처리나, 애니메이션, Ajax 요청과 같은 일들을
    한 번에 여러 개 처리하는 작업이 어려워진다.
    또한 코드를 보면 클로저는 단순히 생성 시점에 유효 범위를 스냅샷한것이 아니라,
    외부에는 노출하지 않고 유효 범위의 상태를 수정할수 있게 해주는 정보은닉 수단이다.
    
### 1.2.3 함수 콘텍스트 바인딩하기 - 이해안됨 다시 보기
    call() 과 apply() 메서드는 함수 콘텍스트 조작을 유용하게 사용될수 있지만,
    객체 지향 코드에 잠재적으로 해로울 수 있다.
    다음 코드를 살펴보자
```javascript
var button = {
    clicked: false,
    click: function(){
        this.clicked = true;
        console.log(button.clicked);
    }
}
```

### 1.2.4 부분 적용 함수
    부분 적용 함수는 함수가 실행되기 전에 미리 인자를 설정하는 기술이다.
    부분 적용 함수는 미리 정의된 인자를 가진 새로운 함수를 반환하고, 반환된 함수는
    나중에 호출할 수 있다. 이것을 프록시 함수(한 함수가 다른 함수를 감싸고, 실행시 
    감싸진 함수가 호출) 라고 한다.
    함수의 몇몇 인자를 채우는 기법을 커링이라고 하는데
    커링을 이해하기 위해 다음 코드를 보자
```javascript
var elements = "val1,val2.val3".split(/,\s*/);
```
    위 코드와 같이 split 메서드에 적절한 정규 표현식을 넘겨주면 간단히 문자열을 분리할수 있지만,
    매번 기억하고 있다가 입력하는 것은 성가시다.
    이 일을 처리해주는 메서드를 만들어보자
```javascript
Function.prototype.partial = function(){
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function(){
        var arg = 0;
        for (var i = 0; i < args.length && arg < arguments.length; i++){
            if (args[i] === undefined) {
                args[i] = arguments[arg++];
            }
        }
        return fn.apply(this, args);
    }
}

String.prototype.csv = String.prototype.split.partial(/,\s*/);

var results = ("star, light, night, lunar");

console.log(results);
```
    코드를 보면 csv 메서드를 split 메서드의 정규표현식 인자를 미리 채운 메서드를
    참조하고 있다. 여기서 partial 메서드는 사용자가 매개변수 목록에서 undefined
    값을 할당하는 방식으로 나중에 넣을 인자를 지정할수 있다.
    그럼 클로저를 이용하는 예를 살펴보자
```javascript
Function.prototype.curry = function(){
    var fn = this, args = Array.prototype.slice.call(arguments);
    return function(){
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    }
}
```
    여기서 우리는 인자를 부분 적용할 함수와 함수에 적용할 인자들을 기억해 두고
    이들을 새로 만들어질 함수에 전달하고자 한다. 
    새로 만들어지는 함수는 미리 채워진 인자들과 전달된 인자들이 합쳐진 새로운
    인자를 전달받게 된다. 하지만 이 예시는 앞의 partial 과 다르게 앞부분만 채워준다.
        
### 1.5 함수 동작 오버라이딩
    자바스크립트가 함수에 대한 상당한 제어 권한을 제공하기 때문에 함수를
    호출하는 사람이 눈치 채지 못하게 함수의 내부 동작을 변경할수 있다는 것이다.
    구체적으로 두 가지 방법이 있는데,
    첫번째로 존재하는 함수의 동작 방식을 수정하는것,
    두번째로 존재하는 정적 함수를 바탕으로 새로운 함수를 만드는 것이다,
    그전에 메모이제이션을 살펴보자
    메모이제이션은 연산 결과를 기억하는 함수를 만들어 내는 것이다.
    다음 코드를 살펴보자
```javascript
Function.prototype.memoized = function(key){
    this._value = this._value || {};
    return this._value[key] !== undefined 
    ? this.value[key]
    : this._value[key] = this.apply(this, arguments);
}

function isPrime(num){
    var prime = num != 1;
    for (var i = 2; i < num; i++){
        if (num % i == 0) {
            prime = false;
            break;
        }
    }
    return prime;
}

console.log(isPrime.memoized(5));
console.log(isPrime._value[5]);
```
    이 코드는 클로저를 사용하지는 않는다.
    존재하는 함수의 내부를 변경하는 데는 한계가 있지만 prototype을 통해서
    함수 하나 혹은 모든 함수에 새로운 메서드를 추가하는 작업은 손쉽게 할 수 있다.
    memoized 메서드는 흥미롭지만, 함수를 호출하는 사람이 메서드의 존재를
    알고 있어야만 한다는 단점이 있다. 즉, 자동으로 메모이제이션을 지원하는
    새로운 함수를 만드는 방법을 살펴보자
```javascript
Function.prototype.memoized = function(key){
    this._value = this._value || {};
    return this._value[key] !== undefined 
    ? this.value[key]
    : this._value[key] = this.apply(this, arguments);
}

Function.prototype.memoize = function(){
    var fn = this;
    return function() {
        return fn.memoized.apply(fn, arguments);
    }
}

var isPrime = (function(num){
    var prime = num != 1;
    for (var i = 2; i < num; i++){
        if (num % i == 0) {
            prime = false;
            break;
        }
    }
    return prime;
}).memoize();

console.log(isPrime(17));
```
    memoize 메서드는 원본 함수에 memoized() 를 적용한 다음, 다시 익명 함수로
    감싼 함수를 반환한다. 이것은 함수를 호출하는 사람이 직접 memoized() 를
    적용할 필요가 없게 해준다.
    여기서 memoize() 메서드 내에서 함수의 콘텍스트를 변수에 복사함으로써
    메모이제이션을 적용하려는 원본 함수를 기억하는 클로저를 생성하는것을 눈여겨 보자.
    이것은 일반적으로 사용하는 방법으로, 각 함수는 자신의 콘텍스트를 가지기 때문에,
    콘텍스트는 클로저의 일부분이 될 수 없다. 하지만 콘텍스트의 값은 그 값을
    저장하는 변수를 이용해서 클로저의 일부분이 되게 할 수 있다.
    원본 함수를 저장해 둠으로써, 우리가 작성한 memoized() 메서드를 호출하는
    새로운 함수를 만들어서 반환할 수 있고, 메모이제이션이 적용된 함수를 직접 호출할수 있다.
    isPrime() 함수를 정의할 때 이상한 방식을 사용하는데, isPrime() 함수가 항상 메모이제이션
    을 제공하기를 원하기 떄문에 메모이제이션을 사용하지 않는 함수는 임시로 만들어야 한다.
    익명으 소수를 판별하는 함수에 memoize() 메서드를 호출해 새로운 함수를 생성하고
    변수에 할당한다. 이것은 원본 함수를 클로저 내에 완벽하게 숨기는 방법이지만,
    코드를 확장할 수 없게 되느 단점도 있다.
    
######다시 볼것
    함수 래핑은 함수의 로직은 외부로 드러내지 않으면서, 새로운 기능을 추가하거나 확장하는 기법이다.
    브라우저가 몇몇 기능을 제공하지 않는 상황에서 크로스 브라우저 코드를 구현할 때
    이 방식을 사용한다. 다음 예시를 살펴보자
```javascript
function wrap(object, method, wrapper){
    var fn = object[method];
    
    return object[method] = function(){
        return wrapper.apply(this, [fn.bind(this)].concat(
            Array.prototype.slice.call(arguments)));
    };
}

if(Prototype.Browser.Opera){
    wrap(Element.Methods, "readAttribute", function(original, elem, attr){
        return attr == "title"
        ? elem.title
        : original(elem, attr);
    })
}
```
    코드를 보면 먼저 원본 메서드의 참조를 fn 에 저장한다. 이는 새로 생성할 익명 함수의
    클로저를 통해서 나중에 접근할 수 있다.
    그 다음 새로운 익명 함수로 해당 메서드를 덮어쓴다. 이 새함수는 전달받은
    wrapper 함수를 실행하는데, 이때 수정된 인자 목록을 전달한다.
    여기서 우리는 첫번쨰 인자가 오버라이딩할 원본 함수이길 원하므로, 원본 함수의
    참조를 저장하는 배열을 생성한다. 그리고 원래 인자들을 배열에 추가한다.