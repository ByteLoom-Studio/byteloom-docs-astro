---
title : JavaWeb项目
sidebar :
  order : 2
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

## 代码编写
我们分成几个部分讲解代码，逐块编写讲解。

---

### 结构创建
根据框架目录，在这个目录下，我们新建四个文件夹。这里的HelloServlet可以直接忽略，这是默认的。

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748506829010-e61c80ad-2c5c-491a-be4d-a5cf7f683344.png)

此外，在webapp中新增几个jsp页面

![](https://cdn.nlark.com/yuque/0/2025/png/43076700/1748506870981-f0254ea0-8f10-477f-9e52-223c4ae2d1d5.png)

这里我没有将页面放在WEB-INF中。

+ **WEB-INF 下的 JSP 是安全的，但不能直接访问**，需通过控制器转发。
+ **WEB-INF 外的 JSP 可以直接访问，但容易暴露业务逻辑。**

放在 WEB-INF 外，浏览器可以直接通过URL访问，例如

`http://localhost:8080/yourapp/index.jsp`

放在 WEB-INF 目录中（如 WEB-INF/views/index.jsp）：

JSP 文件将无法直接通过 URL 访问。例如，这个路径会被禁止访问：

`http://localhost:8080/yourapp/WEB-INF/index.jsp`

只能通过服务器端的控制器（如 Servlet、Spring Controller）转发访问，例如：

`request.getRequestDispatcher("/WEB-INF/views/index.jsp").forward(request, response);`

这是更安全的方式，避免用户绕过业务逻辑直接访问 JSP。一般用于 MVC 框架中（如 Spring MVC）。

---

### DAO层
DAO层需要负责与数据库中的 student 表进行交互。

这里提供了增删改查的方法：

| 方法 | 作用 |
| --- | --- |
| `add(Student s)` | 向表中添加新学生 |
| `list()` | 获取所有学生列表 |
| `delete(int id)` | 根据 ID 删除学生 |
| `get(int id)` | 根据 ID 获取单个学生信息 |
| `update(Student s)` | 更新指定 ID 学生的信息 |


```java
package org.example.servlet1.dao;

import org.example.servlet1.model.Student;
import org.example.servlet1.util.DButil;

import java.sql.*;
import java.util.*;

/**
 * StudentDAO 是学生表（student）的数据访问对象类，封装了对数据库的基本操作。
 * 提供增删改查（CRUD）方法，供业务逻辑层调用。
 */
public class StudentDAO {

    /**
     * 向数据库中添加一个新的学生记录。
     * @param s 学生对象，包含姓名和年龄信息。
     */
    public void add(Student s) {
        String sql = "INSERT INTO student(name, age) VALUES(?, ?)";
        try (Connection conn = DButil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getName());
            stmt.setInt(2, s.getAge());
            stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 查询数据库中所有学生的信息，并返回一个学生列表。
     * @return 包含所有学生的 List。
     */
    public List<Student> list() {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM student";
        try (Connection conn = DButil.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Student s = new Student();
                s.setId(rs.getInt("id"));
                s.setName(rs.getString("name"));
                s.setAge(rs.getInt("age"));
                list.add(s);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 根据指定的学生 ID 删除该学生记录。
     * @param id 学生的唯一标识符。
     */
    public void delete(int id) {
        String sql = "DELETE FROM student WHERE id=?";
        try (Connection conn = DButil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据学生 ID 查询该学生的详细信息。
     * @param id 学生 ID。
     * @return 对应的 Student 对象，如果未找到返回 null。
     */
    public Student get(int id) {
        String sql = "SELECT * FROM student WHERE id=?";
        try (Connection conn = DButil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Student s = new Student();
                s.setId(rs.getInt("id"));
                s.setName(rs.getString("name"));
                s.setAge(rs.getInt("age"));
                return s;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 根据学生的 ID 更新其姓名和年龄信息。
     * @param s 包含更新信息的学生对象（必须包含 ID）。
     */
    public void update(Student s) {
        String sql = "UPDATE student SET name=?, age=? WHERE id=?";
        try (Connection conn = DButil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, s.getName());
            stmt.setInt(2, s.getAge());
            stmt.setInt(3, s.getId());
            stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

---

### Model(JavaBean)
Student 是一个JavaBean类，用于表示学生实体，与数据库表 student 的结构一一对应。

成员变量 id, name, age 分别表示学生的唯一标识、姓名和年龄。

包含：

+ 一个无参构造方法（用于反射或框架初始化）；
+ 一个全参构造方法（方便初始化）；
+ 标准的 getter 和 setter 方法（符合 JavaBean 规范）。

```java
package org.example.servlet1.model;

/**
 * Student 类用于封装学生信息，是与数据库中 student 表对应的实体类。
 */
public class Student {

    // 学生的唯一编号（主键）
    private int id;

    // 学生姓名
    private String name;

    // 学生年龄
    private int age;

    /**
     * 无参构造函数（JavaBean 规范要求）
     */
    public Student() {}

    /**
     * 带参构造函数，用于快速初始化一个学生对象
     * @param id 学生编号
     * @param name 学生姓名
     * @param age 学生年龄
     */
    public Student(int id, String name, int age){
        this.id = id;
        this.name = name;
        this.age = age;
    }

    /**
     * 设置学生年龄
     * @param age 年龄
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * 设置学生姓名
     * @param name 姓名
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 设置学生编号
     * @param id 学生 ID
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * 获取学生姓名
     * @return 姓名
     */
    public String getName() {
        return name;
    }

    /**
     * 获取学生年龄
     * @return 年龄
     */
    public int getAge() {
        return age;
    }

    /**
     * 获取学生编号
     * @return ID
     */
    public int getId() {
        return id;
    }
}

```

---

### Servlet
这个部分比较关键，也比较复杂。我们需要有五个Servlet类的代码文件来负责不同的功能，分别和增删改查对应。

---

`AddStudentServlet`用于处理添加学生的请求。它监听的 URL 路径是 `/add`，并通过 POST 请求将学生信息（姓名和年龄）提交到后端进行处理和保存。

功能分解：

+ **URL映射（@WebServlet("/add")）**：表示当前的 Servlet 会处理 `/add` 路径的请求。
+ **处理 POST 请求（doPost 方法）**：表示当前 Servlet 仅响应 POST 请求（通常用于表单提交）。
+ **获取请求参数**：`req.getParameter("name")`获取表单中的“姓名”。`req.getParameter("age")`获取“年龄”并将其转换为整数。
+ **封装数据**：将前端表单提交的数据封装为 Student 实例。
+ **调用 DAO 层**：StudentDAO 是数据访问对象，用于将学生数据插入到数据库中。dao.add(s) 方法执行具体的数据库操作。
+ **重定向到学生列表页**：操作完成后，通过 `resp.sendRedirect("list")` 重定向到学生列表页面，避免重复提交。

```java
package org.example.servlet1.servlet;

import org.example.servlet1.dao.StudentDAO;
import org.example.servlet1.model.Student;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet 用于处理添加学生的请求
 * URL 映射为 /add
 */
@WebServlet("/add")
public class AddStudentServlet extends HttpServlet {

    /**
     * 处理 POST 请求：接收前端表单提交的学生数据并添加到数据库中
     * @param req  HttpServletRequest 对象，用于获取客户端提交的数据
     * @param resp HttpServletResponse 对象，用于响应客户端
     * @throws IOException
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 从请求中获取学生姓名和年龄参数
        String name = req.getParameter("name");
        int age = Integer.parseInt(req.getParameter("age"));

        // 封装为 Student 对象
        Student s = new Student();
        s.setName(name);
        s.setAge(age);

        // 创建 DAO 对象并调用添加方法将学生保存到数据库
        StudentDAO dao = new StudentDAO();
        dao.add(s);

        // 添加成功后重定向到学生列表页面
        resp.sendRedirect("list");
    }
}

```

---

`DeleteStudentServlet`的作用是处理删除学生的请求。它通过接收 URL 中的 `id` 参数来识别需要删除的学生，然后调用 DAO 层的方法从数据库中删除对应的记录。操作完成后重定向回学生列表页面。

功能分解：

+ **URL映射（**`**@WebServlet("/delete")**`**）**：表示当前 Servlet 用于处理 `/delete` 路径的请求。
+ **处理 GET 请求（**`**doGet**`** 方法）**：该方法通过 GET 请求触发，一般是点击删除链接或按钮发出的请求。
+ **获取请求参数**：`req.getParameter("id")`：获取请求中的 `id` 参数，用于标识需要删除的学生记录。
+ **调用 DAO 层删除方法**：`StudentDAO dao = new StudentDAO();` 创建 DAO 实例。`dao.delete(id);` 调用 `delete()` 方法从数据库中删除该学生记录。
+ **重定向到学生列表页面**：`resp.sendRedirect("list");` 删除完成后，页面跳转到列表页，更新 UI。

```java
package org.example.servlet1.servlet;

import org.example.servlet1.dao.StudentDAO;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet 用于处理删除学生的请求
 * URL 映射为 /delete
 */
@WebServlet("/delete")
public class DeleteStudentServlet extends HttpServlet {

    /**
     * 处理 GET 请求：根据 id 删除指定学生
     * @param req  HttpServletRequest 对象，用于获取请求参数
     * @param resp HttpServletResponse 对象，用于响应客户端
     * @throws IOException
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 获取 URL 中的 id 参数（学生 ID）
        int id = Integer.parseInt(req.getParameter("id"));

        // 创建 DAO 对象并执行删除操作
        StudentDAO dao = new StudentDAO();
        dao.delete(id);

        // 删除后重定向回学生列表页面
        resp.sendRedirect("list");
    }
}

```

---

`EditStudentServlet` 的作用是处理学生信息的编辑请求。它通过接收 URL 中的 `id` 参数获取需要编辑的学生记录，并从数据库中读取该学生的信息。然后将该信息存入请求作用域，并转发到 JSP 页面 `edit.jsp`，以便在前端展示和修改。

功能分解：

+ **URL 映射（@WebServlet("/edit")）**：表示当前 Servlet 用于处理 `/edit` 路径的请求。
+ **处理 GET 请求（doGet 方法）**：该方法通过 GET 请求触发，一般由点击“编辑”按钮或链接发起。
+ **获取请求参数**：`req.getParameter("id")` 获取 URL 中传递的学生 ID。
+ **调用 DAO 层获取学生对象**：通过 `dao.get(id)` 从数据库中查询指定 ID 的学生记录。
+ **将学生对象设置到请求作用域中**：使用 `req.setAttribute("student", student)` 将获取到的学生信息保存到请求作用域。
+ **请求转发到 JSP 页面**：使用 `req.getRequestDispatcher("edit.jsp").forward(req, resp)` 跳转到 JSP 页面进行数据显示和修改操作。

```java
package org.example.servlet1.servlet;

import org.example.servlet1.dao.StudentDAO;
import org.example.servlet1.model.Student;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet 用于处理学生信息编辑请求
 * URL 映射为 /edit
 */
@WebServlet("/edit")
public class EditStudentServlet extends HttpServlet {

    /**
     * 处理 GET 请求：根据学生 id 获取信息并转发到编辑页面
     * @param req  HttpServletRequest 对象，用于获取请求参数和设置属性
     * @param resp HttpServletResponse 对象，用于响应客户端
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // 获取 URL 中的 id 参数（学生 ID）
        int id = Integer.parseInt(req.getParameter("id"));

        // 创建 DAO 对象并根据 id 查询学生信息
        StudentDAO dao = new StudentDAO();
        Student student = dao.get(id);

        // 将学生对象放入请求作用域中供 JSP 页面使用
        req.setAttribute("student", student);

        // 转发请求到编辑页面 edit.jsp
        req.getRequestDispatcher("edit.jsp").forward(req, resp);
    }
}

```

---

`ListStudentServlet` 的作用是处理显示学生列表的请求。它通过调用 DAO 层的 `list()` 方法，从数据库中获取所有学生的信息，并将结果存入请求作用域中，然后转发请求到 JSP 页面 `list.jsp` 显示学生列表。

功能分解：

+ **URL 映射（@WebServlet("/list")）**：该注解目前被注释掉，表示本 Servlet 原计划用于处理 `/list` 路径的请求，如需启用需要取消注释。
+ **处理 GET 请求（doGet 方法）**：该方法响应 GET 请求，通常在用户访问学生列表页面时触发。
+ **调用 DAO 层获取所有学生信息**：通过 `dao.list()` 方法查询数据库中所有学生记录。
+ **将学生列表存入请求作用域中**：使用 `req.setAttribute("students", students)` 将学生列表传递给 JSP 页面。
+ **请求转发到 JSP 页面**：使用 `req.getRequestDispatcher("list.jsp").forward(req, resp)` 将请求转发到 `list.jsp` 页面进行数据展示。

```java
package org.example.servlet1.servlet;

import org.example.servlet1.dao.StudentDAO;
import org.example.servlet1.model.Student;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

//@WebServlet("/list") // 映射为 /list 路径（当前被注释，如需使用请取消注释）
public class ListStudentServlet extends HttpServlet {

    /**
     * 处理 GET 请求：获取所有学生信息并转发到列表页面
     * @param req  HttpServletRequest 对象，用于设置和获取请求参数
     * @param resp HttpServletResponse 对象，用于响应客户端
     * @throws ServletException
     * @throws IOException
     */
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // 创建 DAO 对象并获取所有学生记录
        StudentDAO dao = new StudentDAO();
        List<Student> students = dao.list();

        // 将学生列表设置到请求作用域中供 JSP 页面使用
        req.setAttribute("students", students);

        // 请求转发到 JSP 页面 list.jsp 显示学生信息
        req.getRequestDispatcher("list.jsp").forward(req, resp);
    }
}

```

---

`UpdateStudentServlet` 的作用是处理学生信息的更新请求。它接收前端表单提交的学生 ID、姓名和年龄，然后封装为 `Student` 对象，调用 DAO 层的 `update()` 方法更新数据库中的对应记录。操作完成后重定向到学生列表页面。

功能分解：

+ **URL 映射（@WebServlet("/update")）**：表示当前 Servlet 用于处理 `/update` 路径的请求。
+ **处理 POST 请求（doPost 方法）**：该方法通过 POST 请求触发，一般由提交修改表单的动作发起。
+ **获取请求参数**：  
`req.getParameter("id")`、`req.getParameter("name")` 和 `req.getParameter("age")` 分别获取表单中提交的学生 ID、姓名和年龄。
+ **封装学生对象**：使用 `new Student(id, name, age)` 创建一个包含更新后信息的学生对象。
+ **调用 DAO 层更新方法**：`dao.update(s)` 调用 DAO 的 `update()` 方法在数据库中更新该学生的信息。
+ **重定向到学生列表页面**：使用 `resp.sendRedirect("list")` 操作完成后跳转到列表页，显示更新后的数据。

```java
package org.example.servlet1.servlet;

import org.example.servlet1.dao.StudentDAO;
import org.example.servlet1.model.Student;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet 用于处理更新学生信息的请求
 * URL 映射为 /update
 */
@WebServlet("/update")
public class UpdateStudentServlet extends HttpServlet {

    /**
     * 处理 POST 请求：接收表单数据并更新对应学生信息
     * @param req  HttpServletRequest 对象，用于获取客户端提交的数据
     * @param resp HttpServletResponse 对象，用于响应客户端
     * @throws IOException
     */
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // 获取表单提交的参数：学生 ID、姓名和年龄
        int id = Integer.parseInt(req.getParameter("id"));
        String name = req.getParameter("name");
        int age = Integer.parseInt(req.getParameter("age"));

        // 封装为学生对象
        Student s = new Student(id, name, age);

        // 创建 DAO 对象并调用更新方法
        StudentDAO dao = new StudentDAO();
        dao.update(s);

        // 更新成功后重定向到学生列表页面
        resp.sendRedirect("list");
    }
}

```

---

### Util
`DButil` 是一个数据库工具类，主要用于提供数据库连接。它封装了数据库连接的相关配置和操作，便于其他类（如 DAO 类）通过 `getConnection()` 方法获取与 MySQL 数据库的连接，简化了连接过程，提高了代码的复用性和可维护性。

功能分解：

**数据库连接参数定义**：通过常量 URL、USER 和 PASSWORD 定义了数据库连接所需的基本信息，包括地址、用户名和密码。如果这里是自己配置的环境，需要与本地环境中配置的mysql账户信息相同。

**加载数据库驱动（静态代码块）**：使用 Class.forName("com.mysql.cj.jdbc.Driver") 在类加载时自动加载 MySQL JDBC 驱动程序，确保数据库连接能正常建立。

**获取数据库连接（getConnection 方法）**：通过 DriverManager.getConnection() 使用配置好的参数创建并返回一个数据库连接对象（Connection）。

```java
package org.example.servlet1.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * 数据库工具类，用于获取 MySQL 数据库连接
 */
public class DButil {

    // 数据库连接地址（使用 UTF-8 编码并设置时区）
    private static final String URL = "jdbc:mysql://localhost:3306/studentdb?serverTimezone=UTC";

    // 数据库用户名
    private static final String USER = "root";

    // 数据库密码
    private static final String PASSWORD = "1281838223";

    // 静态代码块：加载 MySQL JDBC 驱动类
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (Exception e) {
            e.printStackTrace(); // 打印异常信息，便于调试
        }
    }

    /**
     * 获取数据库连接的方法
     * @return Connection 数据库连接对象
     * @throws SQLException 如果获取连接失败则抛出 SQLException 异常
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

```

---

### jsp页面
这里其实没啥好说的，就是html+Java，我简单的示例几个可用的页面。

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>添加学生</title>
</head>
<body>
<h2>添加学生</h2>
<form action="add" method="post">
  姓名：<input type="text" name="name"><br><br>
  年龄：<input type="text" name="age"><br><br>
  <input type="submit" value="添加">
</form>
<br>
<a href="list">返回学生列表</a>
</body>
</html>

```

---

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
  <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <html>
      <head>
        <title>修改学生</title>
      </head>
      <body>
        <h2>修改学生信息</h2>
        <form action="update" method="post">
          <input type="hidden" name="id" value="${student.id}">
          姓名：<input type="text" name="name" value="${student.name}"><br><br>
          年龄：<input type="text" name="age" value="${student.age}"><br><br>
          <input type="submit" value="保存修改">
        </form>
        <br>
        <a href="list">返回学生列表</a>
      </body>
    </html>

```

---

```html
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>JSP - Hello World</title>
</head>
<body>
<h1><%= "Hello World!" %></h1>
<br/>
<a href="hello-servlet">Hello Servlet</a>
</body>
</html>
```

---

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*, org.example.servlet1.model.Student" %>
<html>
<head>
  <title>学生列表</title>
</head>
<body>
<h2>学生列表</h2>
<a href="add.jsp">添加学生</a>
<br><br>
<table border="1" cellpadding="8">
  <tr>
    <th>ID</th>
    <th>姓名</th>
    <th>年龄</th>
    <th>操作</th>
  </tr>
  <%
    List<Student> students = (List<Student>) request.getAttribute("students");
    if (students != null) {
      for (Student stu : students) {
  %>
  <tr>
    <td><%= stu.getId() %></td>
    <td><%= stu.getName() %></td>
    <td><%= stu.getAge() %></td>
    <td>
      <a href="edit?id=<%= stu.getId() %>">修改</a> |
      <a href="delete?id=<%= stu.getId() %>" onclick="return confirm('确认删除？')">删除</a>
    </td>
  </tr>
  <%
      }
    }
  %>
</table>
</body>
</html>

```

---

### web.xml
`web.xml` 是 Java Web 项目的部署描述符，用于配置项目的初始化参数、Servlet 映射、过滤器、监听器等内容。放在`WEB-INF`中。这里，我们定义了默认首页（欢迎页）和 `ListStudentServlet` 的 Servlet 映射信息。别的页面一样添加即可。

功能分解：

+ **根元素 **`<web-app>`：表示整个 Web 应用的配置，包含了所有部署相关信息。此处使用的是 Servlet 4.0 规范。
+ **欢迎页面配置（**`<welcome-file-list>`）：设置应用启动时默认访问的页面为 `index.jsp`，当用户访问项目根路径时会自动跳转到此页面。
+ **Servlet 定义（**`<servlet>`）：声明一个名为 `ListStudentServlet` 的 Servlet，指定其完整类路径为 `org.example.servlet1.servlet.ListStudentServlet`，用于初始化和加载 Servlet。
+ **Servlet 映射（**`<servlet-mapping>`）：将上面定义的 Servlet 映射到 URL 路径 `/list`，即用户访问 `/list` 时会由 `ListStudentServlet` 处理请求。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
  version="4.0">
  <welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
  <servlet>
    <servlet-name>ListStudentServlet</servlet-name>
    <servlet-class>org.example.servlet1.servlet.ListStudentServlet</servlet-class>
  </servlet>

  <servlet-mapping>
    <servlet-name>ListStudentServlet</servlet-name>
    <url-pattern>/list</url-pattern>
  </servlet-mapping>
</web-app>
```

---

到这里为止，代码部分就全部编写完成了。当然现在，我们可以根据MVC的模式分析一下代码结构。

```plain
student-management/
├── src/
│   └── main/
│       ├── java/
│       │   └── org.example.servlet1/
│       │       ├── dao/               # 数据访问层（Model）
│       │       │   └── StudentDAO.java
│       │       ├── model/             # 实体类（Model）
│       │       │   └── Student.java
│       │       ├── servlet/           # 控制层（Controller）
│       │       │   ├── AddStudentServlet.java
│       │       │   ├── DeleteStudentServlet.java
│       │       │   ├── EditStudentServlet.java
│       │       │   ├── ListStudentServlet.java
│       │       │   ├── UpdateStudentServlet.java
│       │       ─ util/              # 工具类
│       │           ├── DButil.java
│       │           └── HelloServlet.java
│       ├── resources/                 # 资源文件目录（目前为空）
│       └── webapp/
│           ├── WEB-INF/
│           │   ├── lib/               # 第三方依赖（如 jar 包）
│           │   └── web.xml            # Web 配置文件（部署描述符）
│           ├── index.jsp              # 默认首页（欢迎页面）
│           ├── list.jsp               # 学生列表页面
│           ├── add.jsp                # 添加学生页面
│           └── edit.jsp               # 编辑学生页面
├── test/                              # 测试代码目录（可扩展）
├── target/                            # 编译后输出目录（由 Maven 构建生成）
├── pom.xml                            # Maven 项目配置文件
...
```

---

## MVC分析
### 模型层（Model）
模型层主要负责数据的封装与数据库交互。在本项目中，Student 类是核心的实体类，表示一个学生对象，包含 id、name、age 等基本属性。

除此之外，StudentDAO 类则作为数据访问层，负责与数据库进行直接交互，包括执行增删改查等 SQL 操作。它通过 DButil 提供的统一连接方法来简化数据库连接流程，实现了对数据的封装与管理，保持了业务逻辑的独立性和可复用性。

### 视图层（View）
视图层负责与用户进行交互，主要是以 JSP 页面形式存在。在项目中，index.jsp 是默认首页，list.jsp 用于展示学生列表，edit.jsp 提供数据编辑表单。

这些 JSP 页面通过 JSTL 标签或 JSP 表达式读取请求作用域中的数据（如学生列表或学生对象），实现动态页面渲染，使数据能以直观的方式展现给用户。

### 控制层（Controller）
控制层负责处理请求和协调模型与视图之间的交互。在本项目中，多个 Servlet 类充当了控制器角色，例如：

+ AddStudentServlet 处理新增操作；
+ DeleteStudentServlet 响应删除请求；
+ EditStudentServlet 加载单个学生信息供编辑；
+ UpdateStudentServlet 处理修改后的数据；
+ ListStudentServlet 用于查询学生列表并转发到视图层。

这些 Servlet 接收客户端请求后，根据业务需要调用 StudentDAO，然后通过请求转发或重定向将结果传递给 JSP 页面，完成一次完整的请求-响应周期。

### 总结
整个系统遵循 MVC 架构：Model 负责数据，View 负责展示，Controller 负责流程控制。这种分层使代码结构清晰、职责明确，便于后期维护与扩展，是构建 Web 应用的经典模式。

