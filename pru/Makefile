PRU_CGT:=/usr/share/ti/cgt-pru
PRU_SUPPORT:=/usr/lib/ti/pru-software-support-package
TIDL_API_DIR:=/usr/share/ti/tidl/tidl_api
BUILD_DIR:=build
MAP=$(BUILD_DIR)/stm.map
LINKER_COMMAND_FILE=./AM335x_PRU.cmd

CHIP=am335x
CHIP_REV=am335x
PRU0_DIR=/dev/remoteproc/pruss-core0
PRU1_DIR=/dev/remoteproc/pruss-core1
PRUN=0
#PRU_DIR=/dev/remoteproc/pruss-core1
#PRUN=1

CC=clpru -fe
CFLAGS=--include_path=$(PRU_SUPPORT)/include \
--include_path=$(PRU_SUPPORT)/include/$(CHIP_REV) \
--include_path=$(PRU_CGT)/include \
-v3 -O2 --printf_support=minimal --display_error_number --endian=little --hardware_mac=on \
--obj_directory=$(BUILD_DIR) --pp_directory=$(BUILD_DIR) --asm_directory=$(BUILD_DIR) -ppd -ppa --asm_listing \
--c_src_interlist

LD=lnkpru -o
LDFLAGS=--reread_libs --warn_sections --stack_size=0x100 --heap_size=0x100 \
-i$(PRU_CGT)/lib -i$(PRU_CGT)/include -m$(MAP) $(LINKER_COMMAND_FILE) --library=libc.a \
--library=$(PRU_SUPPORT)/lib/rpmsg_lib.lib

TARGET_PRU0=$(BUILD_DIR)/stm-pru0.out
TARGET_PRU1=$(BUILD_DIR)/stm-pru1.out

TARGETS=$(TARGET_PRU0) $(TARGET_PRU1)

OBJECTS_PRU0=$(BUILD_DIR)/stm-pru0.o
OBJECTS_PRU1=$(BUILD_DIR)/stm-pru1.o

all: build

build: $(TARGETS)

stop:
	@echo "-    Stopping PRUs"
	@echo stop > $(PRU0_DIR)/state || echo Cannot stop PRU 0
	@echo stop > $(PRU0_DIR)/state || echo Cannot stop PRU 1

start:
	@echo "-    Starting PRUs"
	@echo start > $(PRU0_DIR)/state
	@echo start > $(PRU1_DIR)/state

install: build
	@echo '-	copying firmware files to /lib/firmware/'
	@cp $(TARGET_PRU0) /lib/firmware/$(CHIP)-pru0-fw
	@cp $(TARGET_PRU1) /lib/firmware/$(CHIP)-pru1-fw

$(TARGET_PRU0): $(OBJECTS_PRU0)
	@mkdir -p $(BUILD_DIR)
	@echo 'LD	$^'
	@$(LD) $@ $^ $(LDFLAGS)

$(TARGET_PRU1): $(OBJECTS_PRU1)
	@mkdir -p $(BUILD_DIR)
	@echo 'LD	$^'
	@$(LD) $@ $^ $(LDFLAGS)

$(BUILD_DIR)/%.o: %.c
	@mkdir -p $(BUILD_DIR)
	@echo 'CC	$^'
	@$(CC) $@ $^ $(CFLAGS)

clean:
	@echo 'CLEAN'
	@rm -rf $(BUILD_DIR)
