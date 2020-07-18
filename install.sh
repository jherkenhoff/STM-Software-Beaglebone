#!/bin/sh

PATCH_DIR=./patches

apt update
apt upgrade

apt install vsftpd
patch /etc/vsftpd.conf < ${PATCH_DIR}/vsftpd.patch

systemctl enable vsftpd
systemctl start vsftpd

# Compile device tree overlay
cpp -nostdinc -I/opt/source/bb.org-overlays/include/ -undef -x assembler-with-cpp STM-00A0.dts > STM-00A0.dts.preprocessed
cp STM-00A0.dts.preprocessed /lib/firmware/STM-00A0.dts
dtc -I dts -o /lib/firmware/STM-00A0.dtbo -b 0 -@ /lib/firmware/STM-00A0.dts

# Setup uboot for device tree overlay
patch /boot/uEnv.txt < ${PATCH_DIR}/uEnv.txt.patch
