# SmartHomes Web Application

This project is a web application for an online retailer, SmartHomes, allowing customers to browse products, create accounts, and place orders either for in-store pickup or home delivery. The project consists of a React frontend, a backend built using Java servlets and JSP, with data stored in JSON files.

**Technologies Used**
Server Side: Java Servlets<br>
Frontend: React.js, Axios<br>
Backend Server: Apache Tomcat 9.0.94<br>
Data Storage: JSON files (products.json, cart.json, users.json, data.json)<br>
IDE: IntelliJ IDEA (Server), Visual Studio Code (Client)<br>
Build Tools: Maven (Server), npm/Webpack (Client)<br>
Other Libraries: Axios (for HTTP requests)<br>
<br>
<br>
**Features**
Product Management: StoreManager can add, delete, and update products.
User Accounts: Salesmen can create customer accounts, and customers can register online.
Order Placement: Customers can browse products, select store pickup or home delivery, and place orders online.
Shopping Cart: Customers can add/remove items from the cart and proceed to checkout.
Checkout Process: Customers can enter personal and payment information during checkout.
Order Status: Customers can check or cancel their orders.

# Setup Instructions

**Server Side Setup**
Install IntelliJ IDEA: Download and install IntelliJ IDEA from here <a href="https://www.jetbrains.com/idea/" target="_blank">IntelliJ</a>.
Download Tomcat: Download Apache Tomcat Version 9.0.94 from here <a href="https://tomcat.apache.org/download-90.cgi" target="_blank">Tomcat</a>.
Start Tomcat: Deploy the backend to Tomcat and start the server.
Access the backend at http://localhost:8080/backend_war_exploded/.

**Client Side Setup**
Install Visual Studio Code: Download and install VS Code <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>.
Install npm: Ensure that npm (Node.js Package Manager) is installed. You can download it from here <a href="https://nodejs.org/en" target="_blank">Node js</a>.
**Start the React frontend:**
Navigate to the /frontend directory.
Run npm install to install all dependencies.
Run npm start to start the client-side React application.
The app should now be running at http://localhost:3000.

<br>

This includes the steps for both the server and client-side setup, as well as the technologies and project structure. Let me know if you'd like any further adjustments!
