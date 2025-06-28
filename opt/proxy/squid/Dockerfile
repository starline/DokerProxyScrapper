FROM alpine:3.20

ARG PROXY_USER=squiduserqwe
ARG PROXY_PASS=squidpassqwe

RUN apk update && apk add --no-cache \
    squid apache2-utils && \
    htpasswd -cb /etc/squid/passwd "$PROXY_USER" "$PROXY_PASS"

# Копируем кастомный конфиг
COPY squid.conf /etc/squid/squid.conf

EXPOSE 3128

CMD ["squid", "-N", "-d", "1"]