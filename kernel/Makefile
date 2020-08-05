# Makefile for kernel modules and device tree script
# This file is a part of the BeagleLogic project

# Path to kernel sources relative to current directory
KSRC ?= /lib/modules/$(shell uname -r)/build

##################################
# Kernel Module
##################################
# Module targets (run from host)
obj-m := stm.o

all: modules

modules:
	make -C $(KSRC) M=$(PWD) modules

clean:
	make -C $(KSRC) M=$(PWD) clean

##################################
# Device Tree
##################################
overlay: STM-00A0.dtbo

STM-00A0.dts.preprocessed: STM-00A0.dts
	cpp -nostdinc -I/opt/source/bb.org-overlays/include/ -undef -x assembler-with-cpp STM-00A0.dts > STM-00A0.dts.preprocessed

STM-00A0.dtbo: STM-00A0.dts.preprocessed
	dtc -O dtb -o STM-00A0.dtbo -b 0 -@ STM-00A0.dts.preprocessed

install_overlay:
	cp -v STM-00A0.dtbo /lib/firmware
