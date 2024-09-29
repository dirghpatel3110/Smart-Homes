export CATALINA_HOME=/Users/dirgh/Downloads/apache-tomcat-9.0.94


$CATALINA_HOME/bin/shutdown.sh

javac -cp /Users/dirgh/Downloads/apache-tomcat-9.0.94/lib/servlet-api.jar:json.jar:mysql-connector-java.jar:mongo-java.jar -d WEB-INF/classes WEB-INF/classes/model/*.java WEB-INF/classes/filter/*.java WEB-INF/classes/servlets/*.java WEB-INF/classes/utilities/*.java

jar -cvf myservlet.war * 

cp myservlet.war $CATALINA_HOME/webapps/

$CATALINA_HOME/bin/startup.sh 
