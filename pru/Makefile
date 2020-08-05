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

stop: stop_pru0 stop_pru1

stop_pru0:
	@echo "-    Stopping PRU0"
	@echo 'stop' > $(PRU0_DIR)/state || echo "Cannot stop PRU 0. (Current state is \"`cat $(PRU0_DIR)/state`\")"

stop_pru1:
	@echo "-    Stopping PRU1"
	@echo 'stop' > $(PRU1_DIR)/state || echo "Cannot stop PRU 1. (Current state is \"`cat $(PRU1_DIR)/state`\")"

start: stop install
	@echo "-    Setting firmware for PRU0"
	@echo stm-pru0-fw > $(PRU0_DIR)/firmware
	@echo "-    Setting firmware for PRU1"
	@echo stm-pru1-fw > $(PRU1_DIR)/firmware
	@echo "-    Starting PRU0"
	@echo start > $(PRU0_DIR)/state
	@echo "-    Starting PRU1"
	@echo start > $(PRU1_DIR)/state

install: /lib/firmware/stm-pru0-fw /lib/firmware/stm-pru1-fw

/lib/firmware/stm-pru0-fw: $(TARGET_PRU0)
	@echo '-	copying PRU0 firmware to /lib/firmware/stm-pru0-fw'
	@cp $(TARGET_PRU0) /lib/firmware/stm-pru0-fw

/lib/firmware/stm-pru1-fw: $(TARGET_PRU1)
	@echo '-	copying PRU1 firmware to /lib/firmware/stm-pru1-fw'
	@cp $(TARGET_PRU1) /lib/firmware/stm-pru1-fw

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
