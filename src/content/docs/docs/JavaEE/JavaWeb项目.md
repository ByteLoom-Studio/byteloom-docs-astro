---
title : JavaWeb项目
sidebar:
  order : 1
---
> Author : CG
>

所谓的JavaEE其实就是企业版，用于构建企业级应用程序的 Java 平台。它建立在 Java SE（标准版）的基础上，提供了一套适用于大型分布式系统的 API 和运行环境。

JavaEE 应用通常部署在 应用服务器 上，如 Apache Tomcat。这里，我们从一个 JavaWeb 项目起手，先学习一下 JavaEE 的理念。

所有的源代码我会放在我的 NAS 上，可以自取。

我使用的环境是IntelliJ IDEA+JRE23+Tomcat，版本其实不是很重要，项目模板是JavaEE8。

存在代码复用的情况，所以图片里面可能会有一些目录串来串去的问题，如果有没看懂的，可以自己研究一下，也可以直接来问我。

## 需求分析
我们以设计一个学生管理系统为例，需要以下功能：

+ 功能1：登录
+ 功能2：添加学生
+ 功能3：查看学生列表

对应的结构设计：

+ 前端：JSP 页面
+ 控制层：Servlet
+ 业务逻辑层：Service
+ 数据访问层：DAO

主要涉及DAO 模式、JDBC 操作 MySQL、实现增删改查（CRUD）功能。

## 概念解释
看到这里，如果你没有私下学过，可能对很多内容都看不懂。在 JavaEE 中，搭建一个 Web 项目通常会用到几个模块，比如：

+ Servlet
+ JSP
+ DAO
+ Model（JavaBean）
+ JDBC
+ web.xml

```plain
用户（浏览器）
   ↓     ↑
[JSP 页面：显示或填写数据]
   ↓     ↑
[Servlet：控制跳转 + 调用后端]
   ↓     ↑
[DAO：数据库操作（增删改查）]
   ↓     ↑
[JDBC：连接数据库]
```

这里我们逐个解析一下这些内容。



### Model（模型）JavaBean 类
JavaBean 是一个符合规范的 Java 类：属性私有 + 公共构造器 + Getter/Setter。它的作用是表示一个具体的“数据对象”——比如一个学生、一个商品、一个用户。

你写它，是为了**在Java程序中表示数据库的一条记录**，好用对象来存和传数据。

示例：

```java
public class Student {
    private int id;
    private String name;
    private int age;

    // 构造方法、getter、setter
}

```

### **DAO 层（Data Access Object）**
DAO 是一种设计模式，用来专门封装对数据库的操作。DAO层的作用是封装所有“对数据库的操作逻辑”。

你写它，是为了把“查找数据库”、“插入记录”、“更新记录”等操作封装起来，让Servlet只负责业务逻辑，不用写具体的SQL。

示例：

```java
public class StudentDAO {
    public void add(Student s) { }    // 插入学生
    public List<Student> list() { }   // 查询学生列表
    public void delete(int id) { }    // 删除
    public Student get(int id) { }    // 查询单个
    public void update(Student s) { } // 修改
}
```

---

### **JDBC 工具类**
JDBC是Java 提供的用于连接数据库、执行 SQL 的标准 API。工具类提供数据库连接的方法。

你写它，是为了在任何地方都能快速得到一个连接对象。

示例：

```java
public class DBUtil {
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(数据库地址, 用户名, 密码);
    }
}
```

---

### Servlet（控制器）
Servlet是 JavaEE 中最核心的组件之一，用来接收和处理浏览器发来的请求，并返回响应。你写的类要继承 HttpServlet，类似于 Controller，在 MVC 中是“C”。

Servlet作用是接收用户请求、调用 DAO、转发到 JSP。在本次示例中，用来处理表单提交、跳转、增删改查调用。

你写它，是为了完成“接收请求 → 执行业务逻辑 → 返回结果”这整个流程。

示例：

```java
public class AddStudentServlet extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        // 1. 获取表单数据
        // 2. 封装成Student对象
        // 3. 调用DAO插入数据库
        // 4. 跳转到学生列表页
    }
}
```

---

### JSP 页面（前端）
前端页面作用无需多言，显示数据、让用户输入数据。

你写它，是为了展示内容，和提供表单给用户填写。

JSP其实就是可以内嵌java代码的html。

示例：

```html
jsp


复制编辑
<form action="addStudent" method="post">
  姓名: <input name="name">
  年龄: <input name="age">
  <input type="submit" value="添加">
</form>
```

```html
<table>
  <c:forEach var="s" items="${students}">
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.age}</td>
    </tr>
  </c:forEach>
</table>
```

---

### **web.xml 配置文件**
xml是 JavaEE 项目的**部署描述符文件**，配置 Servlet 映射、编码方式、欢迎页面等。在这里，它的作用是告诉 Tomcat：某个 URL 对应哪个 Servlet。

你写它，是为了让浏览器访问 `http://localhost:8080/xxx` 时能准确找到你写的类。

示例：

```xml
<servlet>
  <servlet-name>AddStudentServlet</servlet-name>
  <servlet-class>com.example.servlet.AddStudentServlet</servlet-class>
</servlet>
<servlet-mapping>
  <servlet-name>AddStudentServlet</servlet-name>
  <url-pattern>/addStudent</url-pattern>
</servlet-mapping>
```

### 总结
| 模块 | 你要写的代码文件 | 为什么要写它（作用） |
| --- | --- | --- |
| Model | `Student.java` | 用来在 Java 中表示一个学生 |
| DAO | `StudentDAO.java` | 封装对数据库的增删改查 |
| JDBC工具类 | `DBUtil.java` | 封装数据库连接细节 |
| Servlet | `AddStudentServlet.java`<br/> 等 | 控制整个流程：接收请求 → 调用DAO → 显示页面 |
| JSP | `add.jsp`<br/>, `list.jsp` | 展示页面，接收或显示数据 |
| web.xml | `web.xml` | 配置 Servlet，告诉服务器“谁处理哪个请求” |


## 项目创建
我们从IDEA创建一个空的项目，因为考试的时候我们肯定是没有网络的，这也意味着没有办法下载maven等环境（老师只要求内容不要求跑通）。所以这里，我也不使用maven项目（虽然后面的演示中，我会使用maven环境）。



进来之后，在项目结构中选择模块，新建一个JavaEE项目，配置项如图，这里是JavaWeb模板。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748426239954-77987bd1-9195-4271-9698-e4bca876884a.png)

版本我们选择JavaEE8，依赖默认只有Servlet。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748426272902-8b66b5e4-4c98-4e17-ba2a-75f4487c96d9.png)

现在，我们拥有了一个JavaEE默认模板的项目，结构如图所示。  
![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748426344737-9181e00a-2ee3-4e96-ba02-2588255364e2.png)

现在我们需要引入Tomcat，这里需要提前下载好Tomcat在本机，在自己测试的时候可以本机引入，当然到时候很大概率是没有这个依赖的。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748426400325-088e5ec0-cddc-49fe-8d5c-5c2a65ba579f.png)

引入之后需要修改运行配置，添加一个新的本地Tomcat服务器。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748426433401-b63ef0f4-1b7f-4580-977a-3cc21d56316b.png)

这里咱们会遇到第一个问题，未配置工件。

> 工件是打包好的代码单元，核心作用是将应用的不同功能模块打包成标准格式，以便部署到兼容的服务器上运行。通俗的说就是把你的代码打包起来，发一个可执行文件可以运行。
>
> 我们这里使用到war工件，用于部署web应用，
>
> **包含内容**：
>
> + Servlet、JSP
> + HTML、CSS、JS等静态资源
> + `WEB-INF/web.xml`（部署描述符）
> + Web框架的依赖（如Spring MVC）
>
> **部署位置**：部署到Web容器（如Tomcat、WildFly等）
>

如何解决呢？

首先我们要先通过pom.xml将项目配置为Maven项目，不要问我为什么一开始不用Maven模板。。完全是为了走一遍流程，其实你一开始就直接配置Maven项目是可以直接编译好工件的！现在打开项目结构，工件很大概率已经自动配置好了。

接下来就要在运行配置里加入部署。我们选择war exploded这个工件，执行前编译，启动时部署。这里有一个应用程序上下文，对应了你服务器启动后默认的url。默认是你的工件名，为了方便，可以修改，比如我就很喜欢改成`/`方便调试（温馨提示，考试的时候可没机会调试哦）。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748427518960-3c8ed786-6222-4ad2-9e78-1a140a4b8090.png)

到了这一步，直接基本上就可以运行了。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748427505336-e8f90562-860a-4327-9cab-f36d2be33708.png)

