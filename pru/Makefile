
TARGET=main.pru0
PRU_CGT:=/usr/share/ti/cgt-pru
PRU_SUPPORT:=/usr/lib/ti/pru-software-support-package
TIDL_API_DIR:=/usr/share/ti/tidl/tidl_api
BUILD_DIR:=build
MODEL:=$(shell cat /proc/device-tree/model | sed 's/ /_/g' | tr -d '\000')
LINKER_COMMAND_FILE=./AM335x_PRU.cmd

CHIP=am335x
CHIP_REV=am335x
PROC=pru
PRU_DIR=/dev/remoteproc/pruss-core0
PRUN=0
#PRU_DIR=/dev/remoteproc/pruss-core1
#PRUN=1
EXE=.out

LD=lnkpru -o
LDFLAGS=--reread_libs --warn_sections --stack_size=0x100 --heap_size=0x100 -m $(basename $(1)).map \
-i$(PRU_CGT)/lib -i$(PRU_CGT)/include $(LINKER_COMMAND_FILE) --library=libc.a \
--library=$(PRU_SUPPORT)/lib/rpmsg_lib.lib

CC=clpru -fe
CFLAGS=--include_path=$(PRU_SUPPORT)/include \
--include_path=$(PRU_SUPPORT)/include/$(CHIP_REV) \
--include_path=$(PRU_CGT)/include -DPRUN=$(PRUN)\
-v3 -O2 --printf_support=minimal --display_error_number --endian=little --hardware_mac=on \
--obj_directory=$(BUILD_DIR) --pp_directory=$(BUILD_DIR) --asm_directory=$(BUILD_DIR) -ppd -ppa --asm_listing \
--c_src_interlist

all: stop install start
	@echo "MODEL   = $(MODEL)"
	@echo "PROC    = $(PROC)"
	@echo "PRUN    = $(PRUN)"
	@echo "PRU_DIR = $(PRU_DIR)"

# TODO: think about what we want to say if stop fails
stop:
ifneq ($(PRU_DIR),)
	@echo "-    Stopping PRU $(PRUN)"
	@echo stop > $(PRU_DIR)/state || echo Cannot stop $(PRUN)
endif

start:
	@echo "-    Starting PRU $(PRUN)"
	@echo start > $(PRU_DIR)/state

install: $(BUILD_DIR)/$(TARGET)$(EXE)
ifneq ($(PRU_DIR),)
	@echo '-	copying firmware file $(BUILD_DIR)/$(TARGET).out to /lib/firmware/$(CHIP)-pru$(PRUN)-fw'
	@cp $(BUILD_DIR)/$(TARGET)$(EXE) /lib/firmware/$(CHIP)-pru$(PRUN)-fw
else
	@cp $(BUILD_DIR)/$(TARGET)$(EXE) ./$(TARGET)$(EXE)
endif

%.out: $(BUILD_DIR)/%.out
	@echo 'CP	$^'
	@cp $^ $@

%.so: $(BUILD_DIR)/%.so
	@echo 'CP	$^'
	@cp $^ $@


$(BUILD_DIR)/%.out: $(BUILD_DIR)/%.o
	@mkdir -p $(BUILD_DIR)
	@echo 'LD	$^'
	@$(LD) $@ $^ $(LDFLAGS)

$(BUILD_DIR)/%.so: $(BUILD_DIR)/%.o
	@mkdir -p $(BUILD_DIR)
	@echo 'LD	$^'
	@$(LD) $@ -shared $^ $(LDFLAGS)

$(BUILD_DIR)/%.o: %.c
	@mkdir -p $(BUILD_DIR)
	@echo 'CC	$^'
	@$(CC) $@ $^ $(CFLAGS)

$(BUILD_DIR)/%.o: %.cpp
	@mkdir -p $(BUILD_DIR)
	@echo 'CXX	$^'
	@$(CXX) $@ $^ $(CXXFLAGS)

clean:
	@echo 'CLEAN'
	@rm -rf $(BUILD_DIR)
