# SmartHomes Web Application

This project is a web application for an online retailer, SmartHomes, allowing customers to browse products, create accounts, and place orders either for in-store pickup or home delivery. The project consists of a React frontend, a backend built using Java servlets and JSP, with data stored in JSON files.

**Technologies Used**
<br>
Server Side: Java Servlets<br>
Frontend: React.js, Axios<br>
Backend Server: Apache Tomcat 9.0.94<br>
Data Storage: MySQL and NoSQL <br>
Other Libraries: Axios (for HTTP requests)<br>
<br>
**Features**
<br>
Product Management: StoreManager can add, delete, and update products.<br>
User Accounts: Salesmen can create customer accounts, and customers can register online.<br>
Order Placement: Customers can browse products, select store pickup or home delivery, and place orders online.<br>
Shopping Cart: Customers can add/remove items from the cart and proceed to checkout.<br>
Checkout Process: Customers can enter personal and payment information during checkout.<br>
Order Status: Customers can check or cancel their orders.<br>
Trending Button: Customers can see trending Product.<br>

# Setup Instructions

**Server Side Setup**
<br>
Download Tomcat: Download Apache Tomcat Version 9.0.94 from here <a href="https://tomcat.apache.org/download-90.cgi" target="_blank">Tomcat</a>.<br>
Start Tomcat: Deploy the backend to Tomcat and start the server.<br>

**Client Side Setup**
<br>
Install Visual Studio Code: Download and install VS Code <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>.<br>
Install npm: Ensure that npm (Node.js Package Manager) is installed. You can download it from here <a href="https://nodejs.org/en" target="_blank">Node js</a>.<br>

**Start the React frontend:**
<br>
Navigate to the /frontend directory.<br>
Run npm install to install all dependencies.<br>
Run npm start to start the client-side React application.<br>
The app should now be running at http://localhost:3000.<br>

**Start the Backend:**
<br>
Navigate to the /backend directory.<br>
The app should now be running at http://localhost:8080/myservlet.<br>
(For Macbook) <br>
Run bash run.sh <br>
(For Windows) <br>
1)javac -cp /Users/dirgh/Downloads/apache-tomcat-9.0.94/lib/servlet-api.jar:json.jar:mysql-connector-java.jar:mongo-java.jar -d WEB-INF/classes WEB-INF/classes/model/*.java WEB-INF/classes/filter/*.java WEB-INF/classes/servlets/*.java WEB-INF/classes/utilities/*.java <br>
2) jar -cvf myservlet.war * <br>
3) cp myservlet.war $CATALINA_HOME/webapps/ <br>
4) $CATALINA_HOME/bin/startup.sh <br>

<hr>

This includes the steps for both the server and client-side setup, as well as the technologies and project structure. Let me know if you'd like any further adjustments!
