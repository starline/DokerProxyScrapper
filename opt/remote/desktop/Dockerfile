FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive

# Задаём переменные на этапе сборки
ARG USERNAME=remote
ARG PSWD
ENV HOME_DIR=/home/remote

# Создание пользователя
RUN useradd -m -s /bin/bash "$USERNAME" && echo "$USERNAME:$PSWD" | chpasswd && adduser "$USERNAME" sudo

# Устанавливаем supervisor
RUN apt-get update && apt-get install -y supervisor

# Копируем конфигурацию
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 1. Базовые утилиты и зависимости
RUN apt-get update && apt-get install -y \
    sudo dbus-x11 net-tools apache2-utils xauth policykit-1

# 2. Установка X-сервера и его компонентов
RUN apt-get install -y \
    xorg xinit xserver-xorg-core xserver-xorg xserver-xorg-video-dummy

# 3. Установка оконного менеджера XFCE и графических утилит
RUN apt-get install -y \
    xfce4-session xfce4-panel xfce4-terminal xfwm4 xfdesktop4 thunar mousepad chromium exo-utils

# 4. Установка RDP и прокси
RUN apt-get install -y \
    xrdp xorgxrdp squid

# Уборка
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN echo "export DISPLAY=:0" >> /home/remote/.xsession

# Настройка клавиатуры через .xprofile
RUN echo -e 'setxkbmap -layout us,ru -option grp:alt_shift_toggle' > ${HOME_DIR}/.xprofile && \
    chown $USERNAME:$USERNAME ${HOME_DIR}/.xprofile && \
    echo startxfce4 > ${HOME_DIR}/.xsession && \
    chown $USERNAME:$USERNAME ${HOME_DIR}/.xsession

# Автозапуск setxkbmap через .desktop
RUN mkdir -p ${HOME_DIR}/.config/autostart && \
    echo '[Desktop Entry]' > ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Type=Application' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Exec=setxkbmap -layout us,ru -option grp:alt_shift_toggle' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Hidden=false' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'NoDisplay=false' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'X-GNOME-Autostart-enabled=true' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    chown -R $USERNAME:$USERNAME ${HOME_DIR}/.config

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
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
