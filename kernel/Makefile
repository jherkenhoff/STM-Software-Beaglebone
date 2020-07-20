# Makefile for kernel modules and device tree script
# This file is a part of the BeagleLogic project

# Path to kernel sources relative to current directory
KSRC ?= /lib/modules/$(shell uname -r)/build

# Module targets (run from host)
obj-m := stm.o

all: modules

modules:
		@make -C $(KSRC) M=$(PWD) modules

clean:
		@make -C $(KSRC) M=$(PWD) clean

# Compile and install device tree
overlay: STM-00A0.dtbo

STM-00A0.dtbo: STM-00A0.dts
		dtc -O dtb -o STM-00A0.dtbo -b 0 -@ STM-00A0.dts

deploy_overlay:
		cp -v STM-00A0.dtbo /lib/firmware
