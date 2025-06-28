FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Задаём переменные на этапе сборки
ARG USERNAME
ARG PSWD
ENV HOME_DIR=/home/${USERNAME}

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    sudo xrdp dbus-x11 chromium squid net-tools apache2-utils \
    xfce4-session xfce4-panel xfce4-terminal xfwm4 xfdesktop4 thunar mousepad \
    xorg xinit xserver-xorg-core xserver-xorg xorgxrdp \
    xauth dbus policykit-1 xserver-xorg-video-dummy \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Создание пользователя
RUN useradd -m $USERNAME && echo "$USERNAME:$PSWD" | chpasswd && adduser $USERNAME sudo

# Настройка клавиатуры через .xprofile
RUN echo -e 'setxkbmap -layout us,ru -option grp:alt_shift_toggle' > ${HOME_DIR}/.xprofile && \
    chown remote:remote ${HOME_DIR}/.xprofile && \
    echo startxfce4 > ${HOME_DIR}/.xsession && \
    chown remote:remote ${HOME_DIR}/.xsession

# Автозапуск setxkbmap через .desktop
RUN mkdir -p ${HOME_DIR}/.config/autostart && \
    echo '[Desktop Entry]' > ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Type=Application' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Exec=setxkbmap -layout us,ru -option grp:alt_shift_toggle' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'Hidden=false' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'NoDisplay=false' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    echo 'X-GNOME-Autostart-enabled=true' >> ${HOME_DIR}/.config/autostart/setxkbmap.desktop && \
    chown -R remote:remote ${HOME_DIR}/.config

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