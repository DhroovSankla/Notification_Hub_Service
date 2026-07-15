# --- Build Stage ---
FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY gradlew gradlew.bat settings.gradle.kts build.gradle.kts /app/
COPY gradle /app/gradle
COPY src /app/src

# Build the executable production JAR
RUN ./gradlew bootJar --no-daemon

# --- Runner Stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Expose microservice listener port
EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
