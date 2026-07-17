FROM alibabadragonwell/dragonwell:25.0.3.0.3.9-standard-ga-anolis

ARG JAR_FILE

WORKDIR /app

COPY ${JAR_FILE} /app/app.jar
COPY uploads/ /app/uploads-bundled/
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh \
    && mkdir -p /app/uploads /app/log

EXPOSE 8088

ENTRYPOINT ["/app/docker-entrypoint.sh"]
