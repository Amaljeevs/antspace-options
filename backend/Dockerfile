FROM eclipse-temurin:17-jre
WORKDIR /app

ARG SERVICE_MODULE
COPY backend/${SERVICE_MODULE}/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
