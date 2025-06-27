FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    sudo xrdp xfce4 xfce4-goodies dbus-x11 \
    chromium squid net-tools apache2-utils \
    xserver-xorg-core xserver-xorg xorgxrdp \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Создание пользователя
RUN useradd -m remote && echo "remote:remote" | chpasswd && adduser remote sudo

# Настройка XFCE-сессии с клавиатурой us/ru и переключением Alt+Shift
RUN echo -e '#!/bin/bash\nsetxkbmap -layout us,ru -option grp:alt_shift_toggle\nexec startxfce4' > /home/remote/.xsession && \
    chmod +x /home/remote/.xsession && \
    chown remote:remote /home/remote/.xsession && \
    sed -i.bak '/fi/a startxfce4' /etc/xrdp/startwm.sh

# Настройка базовой аутентификации Squid
RUN htpasswd -cb /etc/squid/passwd squiduser squidpass && \
    echo "auth_param basic program /usr/lib/squid/basic_ncsa_auth /etc/squid/passwd" >> /etc/squid/squid.conf && \
    echo "auth_param basic realm Proxy" >> /etc/squid/squid.conf && \
    echo "acl authenticated proxy_auth REQUIRED" >> /etc/squid/squid.conf && \
    echo "http_access allow authenticated" >> /etc/squid/squid.conf && \
    echo "http_access deny all" >> /etc/squid/squid.conf

# Открываем порты: RDP (3389), Squid proxy (3128)
EXPOSE 3389 3128

# Запуск служб напрямую
CMD ["/bin/bash", "-c", "\
    /usr/sbin/squid && \
    /usr/sbin/xrdp-sesman && \
    /usr/sbin/xrdp -nodaemon"]