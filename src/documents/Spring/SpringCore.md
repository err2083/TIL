***이 글은 스프링5 레시피 을 참고해서 쓴 글입니다.***
# 1. 스프링 코어
## 1.0 개요
     IoC(Inversion of Control) 는 스프링 프레임워크의 심장부라고 할수 있습니다.
     IoC 컨테이너는 POJO (오래된 방식의 단순 자바 객체) 를 구성하고 관리합니다.
     스프링 프레임워크의 가장 중요한 의의가 이 POJO로 자바 애플리케이션을 개발하는 것이므로
     스프링의 주요 기눙운 대부분 IoC 컨테이너 안에서 POJO를 구성 및 관리하는 일과 연관돼 있습니다.
     
## 1.1 자바로 POJO 구성하기
    @Configuration, @Bean을 붙인 자바 구성 클래스를 만들거나, @Component, @Repository,
    @Service, @Controller 등을 붙인 자바 컴포넌트를 구성합니다. IoC 컨테이너는 이렇게 
    어노테이션을 붙인 자바 클래스를 스캐닝하여 애플리케이션의 일부인것처럼 POJO인스턴스/빈을 구성합니다.
    
    @Configuration은 이 클래스가 구성 클래스임을 스프링에게 알리고 @Bean 을 붙인 메서드를 찾습니다.
    @Bean을 붙이면 그 메서드와 동일한 이름의 빈이 생성됩니다.
    
    애노케이션을 붙인 자바 클래스를 스캐닝하려면 우선 IoC 컨테이너를 인스턴스화해야 합니다.
    스프링은 기본 구현체인 Bean Factory 와 이와 호환되는 고급 구현체인 Application context
    두가지 IoC 컨테이너를 제공합니다. Application context 은 빈 팩토리보다 발전된 기능을 가지고
    있으므로 리소스 제약을 받는 상황이 아니라면 이를 사용하는것이 좋습니다.
    Application context 는 Bean Factory의 하위 인터페이스로 호환성이 보장됩니다.
    ApplicationContext 는 인터페이스 이므로 구현체가 필요합니다.
    스프링은 이를 위해 몆가지 구현체를 마련했는데 가장 유명한 AnnotationConfigApplicationContext를 
    권장합니다.
```java
public class Main {
    public static void main() {
        ApplicationContext context = new AnnotationConfigApplicationContext(className.class);    
    }
}
```
    ApplicationContext 를 인스턴스화한 이후에 객체 레퍼런스는 빈에 액세스하는 창구 노릇을 합니다.
    
    구성 클래스에 선언된 빈 팩토리 또는 애플리케이션 컨텍스트 에서 가져오려면 getBean() 메서드의 인수로 호출합니다
    ClassName classname = (ClassName) context.getBean("ClassName");
    또는
    ClassName classname = context.getBean("ClassName", ClassName.class);
    이런식으로 POJO 인스턴스/빈을 스프링 외부에서 생성자를 이용해 객체처럼 사용할 수 있습니다.
    
    클래스에 @Component 를 붘이연 스프링은 이 클래스를 이용해 POJO를 생성합니다.
    또한 스프링에는 퍼시스턴스, 서비스, 프레젠테이션 세 레이어가 있는데 이는 각각
    @Repository, @Service, @Controller 이 세 레이어를 가리키는 애너테이션입니다.
    
    기본적으로 스프링은 @Configuration, @Bean, @Component, @Repository, @Service, @Controller
    가 달린 클래스를 모두 감지합니다. 이때 필터를 이용하여 스캐닝 과정을 커스터마이징 할수 있습니다.
    예를 들어 다음과 같이 선언하면 Dao 나 Service가 포함된 클래스는 스프링이 감지하고 @Controller 를 붙인 클래스는 제외합니다.
```java
@ComponentScan(
    includeFilters = {
        @ComponentScan.Filter(
            type = FilterType.REGEX,
            pattern = {"package.*Dao", "package.*Service"}
        )       
    },
    excludeFilters = {
        @ComponentScan.Filter(
            type = FilterType.REGEX,
            pattern = {"package.stereotype.Controller.class"}
        )
    }
)
```
## 1.2 생성자 호출해서 POJO 생성하기
    POJO 클래스에 생성자를 하나 이상 정의하고, 자바 구성 클래스에서 IoC 컨테이너가 사용할
    POJO 인스턴스 값을 생성자로 설정한 다음 IoC 컨테이너를 인스턴스화 해서 애너테이션을
    붙인 자바 클래스를 스캐닝 하도록 합니다.
```java
@Configuration
public class ShopConfiguration {
    @Bean
    public Object star() {
        Object star = new Object();
        return star;
    }
}

public class Main {
    public static void main() {
       ApplicationContext context = new AnnotationConfigApplicationContext(ShopConfiguration.class);
        
       Object star = context.getBean("star", Object.class);
    }
}
```

## 1.3 POJO 레퍼러스와 자동 연결을 이용해 다른 POJO 와 상호 작용하기
    자바 구성 클래스에 정의된 POJO/빈 인스턴스들 사이의 참조 관계는 표준 자바 코드로도 맺어줄수 있습니다.
    필드, 세터 메서드, 생성자 또는 다른 아무 메서드에 @Autowired를 붙이면 POJO 레퍼런스를 자동으로 연결해 쓸수 있습니다
    
    서비스 객체를 생성하는 서비스 클래스는 직접 대상 클래스를 호출하는 대신 퍼사드를 두어 내부적으로 연동하여 호출하게 됩니다.
    만일 배열형 프로퍼티에 @Autowired를 붙이면 스프링은 매치된 빈을 모두 찾아 연결하게 됩니다.
```java
public class Class {
    @Autowired
    private ClassName[] classNames;
}
```
    배열 뿐만 아나라 타입 안전한 컬렉션(List, Map) 도 빈을 모두 찾아 등록하게 됩니다.
    
    @Autowired 는 POJO 세터 메서드에도 직접 적용할수 있습니다.
```java
public class Class {
    private ClassName className;
    
    @Autowired
    public void setClassName(ClassName className) {
        this.className = className;
    }
}
```
    스프링은 기본적으로 @Autowired 를 붙인 필수 프로퍼티에 해당하는 빈을 찾지 못하면
    예외를 던지는데 @Autowired의 required 속성값을 false로 지정해 스프링 빈을 못찾더라도
    그냥 지나치게 합니다.
    또한 생성자에도 똑같이 적용할수 있습니다(스프링 4.3 버전부터 @Autowired 키워드 생략 가능)
    
    만일 IoC 컨테이너에 호환 타입이 여럿 존재하는 경우 @Primary, @Qualifier 로 해결할 수 있습니다.
    @Primary 는 특정 빈에 우선권을 부여하는것으로 특정 타입의 빈 인스턴스가 여럿이라도 스프링은
    @Primary를 붙인 클래스의 빈 인스턴스를 자동을 연결합니다.
    
    @Qualifier는 빈을 주입하는 곳에 후보 빈을 명시하게 합니다.
```java
public class Class {
    @Autowired
    @Qualifier("name")
    private ClassName className;
}
```
    이는 마찬가지로 생성자 메서드에 인수를 prefix 에 붘여 동일하게 처리할수 있습니다
    
    애플리케이션 규모가 커지면 POJO 설정을 하나의 자바 구성 클래스에 담아두기 어렵기 때문에
    여러 구성 클래스에 나누어 관리합니다.
    
    한가지 방법은 자바 구성 클래스가 위치한 경로마다 애플리케이션 컨텍스트를 초기화하거나,
    @Import로 구성 파일을 나누어 임포트하는 벙법이 있습니다.
    @Import(ClassName.class) 를 붙이면 ClassName 에서 정의한 POJO를 모두
    현재 구성 클래스의 스코프로 가져올 수 있습니다.
    // TODO 세터 필드 생성자 차이점 기술하기 (순환참조 문제 + a)
    
## 1.4 @Resource와 Inject를 붙여 POJO 자동 연결하기
    @Autowired 는 스프링 전용 애너테이션으로, 자바 표준 애너테이션 @Resource(이름), @Inject(타입)로
    POJO를 자동 연결하여 사용할수 있습니다.
    
    @Autowired 는 타입이 같은 POJO가 여럿일때 쓰면 대상이 모호해져 @Qualifier를 써서 이름으로
    다시 찾아야하는 불편함이 있지만 @Resource 는 대상이 명확합니다.
    
    반면 @Inject 는 타입이 같이 POJO가 여럿일때엔 다른 방법을 구사해야하는데
    POJO 주입 클래스와 주입 지점을 구별하기 위한 커스텀 애너테이션을 작성해야 합니다.
```java
@Qualifier
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.PARAMENTER})
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface AnnotationName{
}
```
    이 커스텀 애너테이션을 붙인 @Qualifier는 스프링에서 쓰는 @Qualifier 와는 전혀 다른 패키지에
    속한 애너테이션입니다. 이를 빈 인스턴스를 생성하는 POJO 주입 클래스에 붙이면 됩니다.
    
## 1.5 @Scope를 붙여 POJO 스코프 지정하기
    @Component 같은 애노테이션을 POJO에 붙이는 건 빈 생성에 관한 템플릿을 정의하는것이지, 실제
    빈 인스턴스를 정의하는게 아닙니다. 빈 요청을 할때 스프링은 빈 스코프에 따라 어느 빈 인스턴스를
    반환할지 결정합니다. 이런 상황에서 사용하는게 @Scope 애너테이션으로 빈 스코프를 지정합니다.
    스프링은 IoC 컨테이너에 선언한 빈 마다 인스턴스를 하나 생성하고 이는 전체 컨테이너 스코프에
    공유됩니다. 이 스코프가 모든 빈의 기본 스코프인 singleton 입니다.
|스코프|설명|
|---------|---|
|singleton|IoC 컨테이너당 빈 인스턴스 하나를 생성합니다|
|prototype|요청할 때마다 빈 인스턴스를 새로 만듭니다.|
|request|HTTP 요청당 하나의 빈 인스턴스를 생성합니다. 웹 애플리케이션 컨텍스트만 해당됩니다.
|session|HTTP 세션당 빈 인스턴스 하나를 생성합니다. 웹 애플리케이션 컨텍스트에만 해당됩니다.
|globalSession|전역 HTTP 세션당 빈 인스턴스 하나를 생성합니다. 포털 애플리케이션 컨텍스트에만 해당됩니다.
    
## 1.6 외부 리소스(텍스트, XML, 프로퍼티, 이미지 파일)의 데이터 사용하기
    스프링이 제공하는 @PropertySource를 이용하면 빈 프로퍼티 구성용 .properties 파일을 읽을수 있습니다.
    또 Resource라는 단일 인터페이스를 사용해 어떤 유형의 외부 리소스라도 경로만 지정하면 가져올 수 있는
    리소스 로드 메커니즘이 마련되어 있습니다. @Value로 접두어를 달리 하여 상이한 위치에 존재하는 리소스를 불러
    올 수도 있습니다. 예를 들면 파일시스템 리소스는 file, 클래스패스에 있는 리소스는 classpath.
    리소스 경로는 URL로도 지정 가능합니다.
    
    @PropertySource와 PropertySourcesPlaceholderConfigurer 클래스를 이용하면 빈 프로퍼티
    구성 전용 프로퍼티 파일의 내용(키-값 쌍)을 읽을 수 있습니다. 스프링 Resource 인터페이스에 @Value를
    곁들이면 어느 파일이라도 읽어들일수 있습니다.
    
    예시로 discounts.properties 파일에 다음과 같이 있다고 합시다.
````properties
specialcustomer.discount=0
summer.discount=0.15
endofyear.discount=0.2
````
````java
@Configuration
@PropertySource("classpath:discounts.properties")
@ComponentScan("com.apress.springrecipes.shop")
public class ShopConfiguration {
    @Value("${endofyear.discount:0}")
    private double specialEndofyearDiscountField;
    
    @Bean
    public static PropertySourcesPlaceholderConfigurer configurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
    
    @Bean
    public Integer starlight() {
        return new Integer(specialEndofyearDiscountField);
    }
}
````
    값이 classpath:discounts.properties 인 @PropertySource를 자바 구성 클래스에 붙였습니다.
    스프링은 자바 클래스패스에서 해당 파일을 찾습니다.
    @PropertySource를 붙여 프로퍼티 파일을 로드하려면 PropertySourcesPlaceholderConfigurer 빈을
    @Bean 으로 선언해야합니다. 스프링은 해당 파일을 자동으로 연결하여 파일에 나열된 프로퍼티를 빈 프로퍼티로 활용
    할 수 있습니다. @Value("key:default_value") 는 해당 프로퍼티 파일에 키를 찾아보고 값을 넣어주는데 없으면
    default_value 를 할당합니다.
    
    프로퍼티 파일 데이터를 빈 프로퍼티 구성 외의 다른 용도로 쓰려면 Resource 메커니즘을 이용해야합니다.
    private Resource txt; 라는 코드가 있을때
    @Value 에 값을 .txt 로 세팅한다고 생각하면 미리 등록된 프로퍼티 편집기 ResourceEditor를 이용해
    파일을 빈에 주입하기 전 Resource 객체로 변환합니다.
    
    만일 서비스에서 프로퍼티를 읽어야한다면 다음과 같이 할 수 있습니다.
```java
public class Main {
    public static void main(String[] args){
        Resource resource = new ClassPathResource("discounts.properties");
        Properties props = PropertiesLoaderUtils.loadProperties(resource);
    }
}
```
    해당 프로퍼티 파일의 경우 자바 클래스패스에 있다고 가정했지만 외부 파일시스템에 있는 리소스는
    FileSystemResource로 가져옵니다.
    URL로 외부 리소스를 액세스 하려면 스프링 UrlResource를 이용합니다.
    
## 1.7 프로퍼티 파일에서 로케일마다 다른 다국어 메시지를 해석하기
    MessageSource 인터페이스에는 리소스 번들 메시지를 처리하는 메서드가 정의 되어있습니다.
    ResourceBundleMessageSource는 가장 많이 쓰는 구현체로 로케일 별로 분리된 리소스 번들 메시지를
    해석합니다.
```java
@Configuration
public class ShopConfiguration {
    @Bean
    public ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource =
            new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:messages");
        messageSource.setCacheSeconds(1);
        return messageSource;
    }
}
```
    빈 인스턴스는 반드시 messageSource 라고 명명해서 애플리케이션 컨텍스트가 알아서 감지합니다.
    setBasenames 는 번들 위치를 지정, setCacheSeconds 는 캐시 주기를 1초로 해서 쓸모없는 메시지를
    다시 읽지 않게 합니다. 이렇게 MessageSource를 정의하고 영어가 주 언어인 미국 로케일애서 텍스트를 찾으면
    messages_en_US.properties 리소스 번들 파일이 읽혀집니다.
```java
@Component
public class Cashier {
    @Autowired
    private MessageSource messageSource;
    public void checkout() {
        String message = messageSource.getMessage("key", null, Locale.US);
        System.out.println(message);
    }
}
```
## 1.8 애너테이션을 이용해 POJO 초기화/폐지 커스터마이징하기
    어떤 POJO는 사용하기 전에 특정한 초기화 작업을 거쳐야 합니다. 예를 들어 파일을 열거나, 네트워크/DB 요청,
    메모리 할당 등 선행 작업이 필요한 경우입니다. 이런 POJO 는 생명이 다하는 순간 폐기 작업을 진행해주어야
    합니다. 자바 구성 클래스의 @Bean 정의부에서 initMethod, destroyMethod 속성을 설정하면
    스프링은 이들을 각각 초기화, 폐기 콜백 메서드로 인지합니다. 또는 POJO 메서드에 각각
    @PostConstruct 및 PreDestory 를 붙여도 됩니다. 또 스프링은 @Lazy 를 붙여 주어진 시점까지
    빈 생성을 미룰수 있고, @DependsOn 으로 빈 생성전에 다른 빈 생성을 강제할수 있습니다.
    다음은 파일 작업을 하는 클래스 입니다.
```java
public class FileLorder {
    @Setter
    private String fileName;
    @Setter
    private String path;
    @Setter
    private String extension;
    private BufferedWriter writer;
    
    public void openFile() throws IOException {
        File targetDir = new FIle(path);
        if (!targetDir.exists()) {
            targetDir.mkdir();
        }
        File checkoutFile = new FIle(path, fileName + extension);
        if (!checkoutFile.exists()) {
            checkoutFile.createNewFile();
        }

        writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(checkoutFile, true)));
    }

    public void checkout() throws IOExcetion {
        writer.write(/*content*/);
        writer.flush();
    } 
    public void closeFile() throws IOException {
        writer.close();
    }   
}
```
    FileLorder 클래스을 빈 생성 이전에 openFile() 메서드를 폐기 직전에 closeFile() 메서드를
    실행하도록 자바 구성 클래스에 빈 정의부를 설정합시다.
```java
@Configuration
public class ShopConfiguration {
    @Bean(initMethod="openFile", destroyMethod="closeFile")
    public FileLoader fileLoader() {
        // ...
    }
}
```
    @Bean 의 initMethod, destroyMethod 속성에 각가 초기화, 폐기 작업을 할 메서드를 지정하면
    인스턴스 생성전에 메서드를 먼저 트리거 할 수 있습니다.
    
    자바 구성 클래스 와부에 POJO 클래스를 정의할 경우 클래스에 @Component 를 붙이고
    초기화할 메서드에 @PostConstruct, 폐기 메서드에 @PreDestory 을 지정하면 됩니다.
    
    스프링은 모든 POJO를 애플리케이션 시동과 동시에 POJO를 초기화합니다. 이 초기화를 뒤로 미루는 개념을
    느긋한 초기화 라고 합니다. 주로 네트워크 접속, 파일 처리 등에 사용됩니다.
    빈에 @Lazy 를 붘이면 적용이 됩니다.
    
    POJO가 늘어나면 그에 따른 POJO 초기화 횟수도 증가하게 됩니다. 이때 자바 구성 클애스에 분산 선언된
    많은 POJO가 서로를 참조하게 되면 경합조건이 일어나기 쉽습니다. 이는 A라는 빈이 B에 의존하는 경우에
    B가 생성전에 A가 생성되는 것입니다. 이때 @DependsOn 애너테이션을 붘여 POJO 순서를 강제할수 있습니다.
    자바 구성 클래스의 빈에 @DependsOn("className") 를 붙이면 해당 빈은 className 보다
    늦게 생성됩니다.

## 1.9 후처리기를 만들어 POJO 검증/수정하기
    빈 후처리기를 이용하면 초기화 콜백 메서드(@initMethod ,@PostConstruct) 전후 원하는 로직을
    빈에 적용할수 있습니다. 빈 후처리기는 IoC 컨테이너 내부의 모든 빈 인스턴스를 대상으로 합니다.
    @Required는 스프링에 내장된 후처리기 RequiredAnnotationBeanPostProcessor가 지원하는
    애너테이션 입니다.
    
    빈 후처리기는 BeanPostProcessor 인터페이스를 구현한 객체입니다. 이 인터페이스를 구현한 객체를
    발견하면 스프링은 모든 빈 인스턴스에 postProcessBeforeInitialization(),
    postProcessAfterInitialization() 두 메서드를 적용합니다.
```java
@Component
public class AuditCheckBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) 
        throws BeanException {
        return bean;
    }
}
```
postProcessBeforeInitialization(), postProcessAfterInitialization() 메서드는
반드신 빈 인스턴스를 반환해주어야 합니다. 애플리케이션 컨텍스트는 BeanPostProcessor 구현 빈을 감지해
컨테이너 안에 있는 다른 빈 인스턴스에 일괄 적용합니다.

특정 빈 프로퍼티가 설정되어있는지 체크하고 싶은 경우 커스텀 후처리기를 작성하고 해당 프로퍼티에
@Required를 붙입니다. 이를 붙인 프로퍼티는 스프링이 감지해서 값의 존재 여부를 조사하고 
프로퍼티값이 없으면 BeanInitializationException 예외를 던집니다.

## 1.10 팩토리(정적 메서드, 인스턴스 메서드, 스프링 팩토리빈)로 POJO 생성하기