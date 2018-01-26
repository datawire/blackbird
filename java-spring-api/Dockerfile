FROM openjdk:8-jdk-slim as runtime
MAINTAINER Datawire <dev@datawire.io>

ENV TERM=dumb

WORKDIR /srv
COPY    . .
RUN     ./gradlew test build

ENTRYPOINT ["java"]
CMD ["-jar", "build/libs/hello-forge-springboot-0.0.1-SNAPSHOT.jar"]
