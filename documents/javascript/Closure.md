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
    
### 1.2.3 함수 콘텍스트 바인딩하기
    