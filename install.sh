#!/bin/sh

PATCH_DIR=./patches

# Update system
apt update
apt upgrade

# Install dependencies
apt install vsftpd # FTP server. Udeful for development and debugging
apt install linux-headers-$(uname -r) # Kernel headers are required for driver compilation
apt install cython3
apt install python-numpy

pip3 install wheel

# Configure and start FTP service
patch /etc/vsftpd.conf < ${PATCH_DIR}/vsftpd.patch
systemctl enable vsftpd
systemctl start vsftpd

# Compile device tree overlay
cpp -nostdinc -I/opt/source/bb.org-overlays/include/ -undef -x assembler-with-cpp STM-00A0.dts > STM-00A0.dts.preprocessed
cp STM-00A0.dts.preprocessed /lib/firmware/STM-00A0.dts
dtc -I dts -o /lib/firmware/STM-00A0.dtbo -b 0 -@ /lib/firmware/STM-00A0.dts

# Setup uboot for device tree overlay
patch /boot/uEnv.txt < ${PATCH_DIR}/uEnv.txt.patch

create_stm_group() {
	echo "Creating stm group"
	groupadd -f stm
	usermod -aG stm debian
}

# Udev rules required to allow the default user to access the STM devices
# sysfs attributes without requiring root permissions
install_udev_rules() {
	echo "Installing udev rules"
	cp -v "${DIR}/scripts/90-stm.rules" "/etc/udev/rules.d/"
}

create_stm_group
install_udev_rules

install_systemd_services() {
	echo "Installing systemd services"
	cp -v "${DIR}/scripts/stm-config-pins.sh" "/usr/local/bin/stm-config-pins.sh"
	cp -v "${DIR}/scripts/stm-config-pins.service" "/etc/systemd/system/stm-config-pins.service"
	chown root:stm "/usr/local/bin/stm-config-pins.sh"
	chmod +x "/usr/local/bin/stm-config-pins.sh"
	systemctl enable stm-config-pins.service
	systemctl start stm-config-pins.service
}

install_systemd_services()

pushd pystm/
pip3 install .
popd

pushd backend/
echo "Installing backend dependencies"
pip3 install -r requirements.txt
popd
