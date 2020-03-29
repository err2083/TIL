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
    