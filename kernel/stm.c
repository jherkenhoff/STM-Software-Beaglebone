// https://lwn.net/Articles/448502/


#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/uaccess.h>
#include <linux/device.h>
#include <linux/platform_device.h>
#include <linux/miscdevice.h>
#include <linux/kobject.h>
#include <linux/dma-mapping.h>

#include <linux/pruss.h>
// #include <linux/pruss_intc.h>
#include <linux/remoteproc.h>

#include <linux/of.h>
#include <linux/of_platform.h>
#include <linux/of_address.h>
#include <linux/of_device.h>

#include <linux/sysfs.h>
#include <linux/fs.h>

#include "../common/circularbuffer.h"
#include "../pru/stm-pru0.h"
#include "../pru/stm-pru1.h"

#define DRV_NAME	"stm"
#define DRV_VERSION "1.0"

struct stm_private_data {
	const char *fw_names[PRUSS_NUM_PRUS];
};

static struct stm_private_data stm_pdata = {
	.fw_names[0] = "stm-pru0-fw",
	.fw_names[1] = "stm-pru1-fw",
};

// Mapping between device tree node and driver
static const struct of_device_id stm_dt_ids[] = {
	{ .compatible = "stm,stm", .data = &stm_pdata, },
	{ /* sentinel */ },
};
MODULE_DEVICE_TABLE(of, stm_dt_ids);

struct stm_dev {
	/* Misc device descriptor */
	struct miscdevice miscdev;

	struct pruss *pruss;
	struct rproc *pru0, *pru1;
	struct pruss_mem_region pru0sram, pru1sram;
	const struct stm_private_data *fw_data;

	/* Private data */
	struct device *p_dev; /* Parent platform device */

	/* Device capabilities */
	volatile struct arm_pru0_share *arm_pru0_share;
	volatile struct arm_pru1_share *arm_pru1_share;

	void *pattern_buffer;
	void *adc_buffer;
};

/*******************************************************************************
 * File operations
 ******************************************************************************/

// Macro used to get a pointer to the parent stm_dev struct based on a pointer to
// the miscdev struct stored inside stm_dev
#define to_stmdev(dev) container_of((dev), struct stm_dev, miscdev)

static int stm_f_open(struct inode *inode, struct file *filp) {
	// struct stm_dev *stmdev = to_stmdev(filp->private_data);
	//struct device *dev = stmdev->miscdev.this_device;

	return 0;
}

ssize_t stm_f_write(struct file *filp, const char *buf, size_t count, loff_t *f_pos) {
	struct stm_dev *stmdev = to_stmdev(filp->private_data);
	struct device *dev = stmdev->miscdev.this_device;
	size_t write_cnt;
	void *pattern_buffer_pos;

	if (stmdev->pattern_buffer == NULL) {
		dev_warn(dev, "Tried to write to pattern buffer, but no memory has been assigned to it\n");
		return -ENOBUFS;
	}

	if (count % sizeof(struct scan_point) != 0) {
		dev_warn(dev, "Tried to write %d bytes, but only multiples of %d bytes are supported\n", count, sizeof(struct scan_point));
		return -EINVAL;
	}

	write_cnt = CircularBufferPrepareBulkPush(&stmdev->arm_pru1_share->pattern_buffer_ctx, stmdev->pattern_buffer, &pattern_buffer_pos);


	if (write_cnt == 0)
		return 0;

	count = min(write_cnt*sizeof(struct scan_point), count);

	dev_info(dev, "Writing %d bytes to pattern buffer\n", count);

	if (copy_from_user(pattern_buffer_pos, buf, count)) {
		dev_warn(dev, "Could not copy_from_user\n");
		return -EFAULT;
	}
	CircularBufferCommitBulkPush(&stmdev->arm_pru1_share->pattern_buffer_ctx, count/sizeof(struct scan_point));

	return count;
}

ssize_t stm_f_read(struct file *filp, char *buf, size_t count, loff_t *f_pos) {
	// struct stm_dev *stmdev = to_stmdev(filp->private_data);
	// struct device *dev = stmdev->miscdev.this_device;
	// size_t read_cnt;
	// void *scan_buf;
	//
	// if (!CircularBufferIsAllocated(&stmdev->arm_pru1_share->scan_buffer)) {
	// 	dev_warn(dev, "Tried to read from sample buffer, but no memory has been assigned to it\n");
	// 	return -ENOBUFS;
	// }
	//
	//
	// read_cnt = CircularBufferPrepareBulkPop(&stmdev->arm_pru1_share->scan_buffer, &scan_buf);
	//
	// count = min(read_cnt*sizeof(struct scan_point), count);
	// if (copy_to_user(buf, scan_buf, count)) {
	// 	dev_warn(dev, "Could not copy_to_user\n");
	// 	return -EFAULT;
	// }
	//
	// CircularBufferCommitBulkPop(&stmdev->arm_pru1_share->scan_buffer, count/sizeof(struct scan_point));

	return count;
}

static loff_t stm_f_llseek(struct file *filp, loff_t offset, int whence) {
	// We do not support seeking...
	return -ESPIPE;
}

unsigned int stm_f_poll(struct file *filp, struct poll_table_struct *tbl) {
	return 0;
}

static int stm_f_release(struct inode *inode, struct file *filp) {
	return 0;
}


static const struct file_operations stm_fops = {
	.owner = THIS_MODULE,
	.open = stm_f_open,
	.write = stm_f_write,
	.read = stm_f_read,
	.llseek = stm_f_llseek,
	.poll = stm_f_poll,
	.release = stm_f_release,
};


/**** Sysfs attributes ********************************************************/
static ssize_t adc_averages_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t averages;

	if (kstrtoint(buf, 10, &averages))
		return -EINVAL;
	if (averages == 0)
		return -EINVAL;
	stmdev->arm_pru0_share->adc_averages = averages;
	return count;
}

static ssize_t adc_averages_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru0_share->adc_averages);
}

static ssize_t adc_value_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru0_share->adc_value);
}

static ssize_t pid_setpoint_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t pid_setpoint;

	if (kstrtoint(buf, 10, &pid_setpoint))
		return -EINVAL;
	stmdev->arm_pru1_share->pid_setpoint = pid_setpoint;
	return count;
}

static ssize_t pid_setpoint_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->pid_setpoint);
}

static ssize_t pid_kp_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t pid_kp;

	if (kstrtoint(buf, 10, &pid_kp))
		return -EINVAL;
	stmdev->arm_pru1_share->pid_kp = pid_kp;
	return count;
}

static ssize_t pid_kp_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->pid_kp);
}

static ssize_t pid_ki_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t pid_ki;

	if (kstrtoint(buf, 10, &pid_ki))
		return -EINVAL;
	stmdev->arm_pru1_share->pid_ki = pid_ki;
	return count;
}

static ssize_t pid_ki_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->pid_ki);
}

static ssize_t pid_kd_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t pid_kd;

	if (kstrtoint(buf, 10, &pid_kd))
		return -EINVAL;
	stmdev->arm_pru1_share->pid_kd = pid_kd;
	return count;
}

static ssize_t pid_kd_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->pid_kd);
}

static ssize_t dac_x_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t dac_value;

	if (is_scan_enabled(stmdev->arm_pru1_share))
		return -EBUSY; // We cannot manually set the dac values while scan is running

	if (kstrtoint(buf, 10, &dac_value))
		return -EINVAL;
	stmdev->arm_pru1_share->dac_x = dac_value;
	return count;
}

static ssize_t dac_x_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->dac_x);
}

static ssize_t dac_y_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t dac_value;

	if (is_scan_enabled(stmdev->arm_pru1_share))
		return -EBUSY; // We cannot manually set the dac values while scan is running

	if (kstrtoint(buf, 10, &dac_value))
		return -EINVAL;
	stmdev->arm_pru1_share->dac_y = dac_value;
	return count;
}

static ssize_t dac_y_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->dac_y);
}

static ssize_t dac_z_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t dac_value;

	if (is_pid_enabled(stmdev->arm_pru1_share))
	    return -EBUSY; // We cannot manually set the dac values while pid loop is running

	if (kstrtoint(buf, 10, &dac_value))
		return -EINVAL;
	stmdev->arm_pru1_share->dac_z = dac_value;
	return count;
}

static ssize_t dac_z_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->dac_z);
}

static ssize_t scan_enable_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	uint32_t enable;
	if (kstrtoint(buf, 10, &enable))
		return -EINVAL;
  set_scan_enabled(stmdev->arm_pru1_share, (bool)enable);
	return count;
}

static ssize_t scan_enable_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", is_scan_enabled(stmdev->arm_pru1_share));
}

static ssize_t pid_enable_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	uint32_t enable;
	if (kstrtoint(buf, 10, &enable))
		return -EINVAL;
  set_pid_enabled(stmdev->arm_pru1_share, (bool)enable);
	return count;
}

static ssize_t pid_enable_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", is_pid_enabled(stmdev->arm_pru1_share));
}

static ssize_t pattern_buffer_size_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	size_t new_size;
	dma_addr_t dma_handle;

	// Check if scan is currently running (We cant resize the pattern buffer when running)
	if (is_scan_enabled(stmdev->arm_pru1_share)) {
		dev_warn(dev, "Tried to set pattern buffer size while scan is running");
		return -EBUSY;
	}

	if (kstrtoint(buf, 10, &new_size))
		return -EINVAL;
	dev_dbg(dev, "Resizing pattern buffer to %d sample points\n", new_size);

	// Fail if new buffer size is not a power of two
	if ((new_size & (new_size - 1)) != 0) {
		dev_warn(dev, "Tried to set pattern buffer size to %d, but only powers of two are supporte", new_size);
		return -EINVAL;
	}

	CircularBufferReset(&stmdev->arm_pru1_share->pattern_buffer_ctx);

	// Free the previously allocated buffer memory
	if (stmdev->pattern_buffer != NULL) {
		dma_free_coherent(dev,
			(stmdev->arm_pru1_share->pattern_buffer_ctx.max_size+1)*sizeof(struct scan_point),
			stmdev->pattern_buffer,
			(dma_addr_t)stmdev->arm_pru1_share->pattern_buffer);
		stmdev->pattern_buffer = NULL;
		stmdev->arm_pru1_share->pattern_buffer = NULL;
	}

	if (new_size > 0) {
		stmdev->pattern_buffer = dma_alloc_coherent(dev,
												 new_size*sizeof(struct scan_point),
												 &dma_handle,
												 GFP_KERNEL);
		if (!stmdev->pattern_buffer) {
			dev_err(dev, "Scan buffer allocation failed\n");
			return -EFAULT;
		}
		stmdev->arm_pru1_share->pattern_buffer = (void*)dma_handle;
		dev_info(dev, "Allocated pattern buffer memory for %d entries. Physical addr: %x", new_size, dma_handle);
		CircularBufferInit(&stmdev->arm_pru1_share->pattern_buffer_ctx, new_size, sizeof(struct scan_point));
	}

	return count;
}

static ssize_t pattern_buffer_size_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->pattern_buffer_ctx.max_size+1);
}

static ssize_t pattern_buffer_used_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", CircularBufferSize(&stmdev->arm_pru1_share->pattern_buffer_ctx));
}

static ssize_t bias_voltage_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t dac_bias;
	if (kstrtoint(buf, 10, &dac_bias))
		return -EINVAL;
	dev_info(dev, "Setting bias voltage to %d\n", dac_bias);
	stmdev->arm_pru1_share->dac_bias = dac_bias;
	return count;
}

static ssize_t bias_voltage_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->dac_bias);
}

static ssize_t stepper_dir_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t dir;
	if (kstrtoint(buf, 10, &dir))
		return -EINVAL;
	stmdev->arm_pru1_share->stepper_dir = dir;
	return count;
}

static ssize_t stepper_dir_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->stepper_dir);
}

static ssize_t stepper_steps_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	int32_t steps;
	if (kstrtoint(buf, 10, &steps))
		return -EINVAL;
	stmdev->arm_pru1_share->stepper_steps = steps;
	return count;
}

static ssize_t stepper_steps_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->stepper_steps);
}

// Everyone is allowed to read (0444), but only owner and group are allowed to write (0664)
static DEVICE_ATTR(adc_averages, 0664, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(adc_value, 0444, adc_value_show, NULL);
static DEVICE_ATTR(pid_setpoint, 0664, pid_setpoint_show, pid_setpoint_store);
static DEVICE_ATTR(pid_kp, 0664, pid_kp_show, pid_kp_store);
static DEVICE_ATTR(pid_ki, 0664, pid_ki_show, pid_ki_store);
static DEVICE_ATTR(pid_kd, 0664, pid_kd_show, pid_kd_store);
static DEVICE_ATTR(dac_x, 0664, dac_x_show, dac_x_store);
static DEVICE_ATTR(dac_y, 0664, dac_y_show, dac_y_store);
static DEVICE_ATTR(dac_z, 0664, dac_z_show, dac_z_store);
static DEVICE_ATTR(scan_enable, 0664, scan_enable_show, scan_enable_store);
static DEVICE_ATTR(pid_enable, 0664, pid_enable_show, pid_enable_store);
static DEVICE_ATTR(pattern_buffer_size, 0664, pattern_buffer_size_show, pattern_buffer_size_store);
static DEVICE_ATTR(pattern_buffer_used, 0444, pattern_buffer_used_show, NULL);
static DEVICE_ATTR(bias_voltage, 0664, bias_voltage_show, bias_voltage_store);
static DEVICE_ATTR(stepper_dir, 0664, stepper_dir_show, stepper_dir_store);
static DEVICE_ATTR(stepper_steps, 0664, stepper_steps_show, stepper_steps_store);

static struct attribute *stm_attributes[] = {
	&dev_attr_adc_averages.attr,
	&dev_attr_adc_value.attr,
	&dev_attr_pid_setpoint.attr,
	&dev_attr_pid_kp.attr,
	&dev_attr_pid_ki.attr,
	&dev_attr_pid_kd.attr,
	&dev_attr_dac_x.attr,
	&dev_attr_dac_y.attr,
	&dev_attr_dac_z.attr,
	&dev_attr_scan_enable.attr,
	&dev_attr_pid_enable.attr,
	&dev_attr_pattern_buffer_size.attr,
	&dev_attr_pattern_buffer_used.attr,
	&dev_attr_bias_voltage.attr,
	&dev_attr_stepper_dir.attr,
	&dev_attr_stepper_steps.attr,
	NULL
};

static struct attribute_group stm_attr_group = {
	.attrs = stm_attributes
};

static int stm_probe(struct platform_device *pdev) {
	struct stm_dev *stmdev;
	struct device *dev;
	struct device_node *node = pdev->dev.of_node;
	const struct of_device_id *match;
	int ret;

    pr_info("STM Driver probe\n");

    // Check if device-tree is supported, else return
    if (!node) {
		pr_err("Device tree is not supported on this platform\n");
        return -ENODEV;
	}

    // Check if the device (pdev) is supported by this driver
    match = of_match_device(stm_dt_ids, &pdev->dev);
    if (!match) {
		pr_err("Device is not supported by this driver\n");
        return -ENODEV;
	}

	// Allocate memory for device structure
	stmdev = devm_kzalloc(&pdev->dev, sizeof(*stmdev), GFP_KERNEL);
	if (!stmdev) {
		pr_err("Failed to alloc memory for stmdev\n");
		ret = -1;
		goto fail;
	}
    pr_info("Memory alloc successfull\n");

	// Initialize stm device members
	stmdev->fw_data = match->data;
	stmdev->miscdev.fops  = &stm_fops;
	stmdev->miscdev.minor = MISC_DYNAMIC_MINOR;
	stmdev->miscdev.mode  = S_IRUGO;
	stmdev->miscdev.name  = "stm";

	// Link the platform device data to our private structure
	stmdev->p_dev = &pdev->dev;
	dev_set_drvdata(stmdev->p_dev, stmdev);

	/* Get a handle to the PRUSS structures */
	dev = &pdev->dev;

	stmdev->pru0 = pru_rproc_get(node, PRUSS_PRU0);
	if (IS_ERR(stmdev->pru0)) {
		ret = PTR_ERR(stmdev->pru0);
		if (ret != -EPROBE_DEFER)
			dev_err(dev, "Unable to get PRU0.\n");
		// goto fail_free;
	}

	stmdev->pruss = pruss_get(stmdev->pru0);
	if (IS_ERR(stmdev->pruss)) {
		ret = PTR_ERR(stmdev->pruss);
		if (ret != -EPROBE_DEFER)
			dev_err(dev, "Unable to get pruss handle.\n");
		goto fail_pru0_put;
	}

	stmdev->pru1 = pru_rproc_get(node, PRUSS_PRU1);
	if (IS_ERR(stmdev->pru1)) {
		ret = PTR_ERR(stmdev->pru1);
		if (ret != -EPROBE_DEFER)
			dev_err(dev, "Unable to get PRU0.\n");
		goto fail_pruss_put;
	}

	ret = pruss_request_mem_region(stmdev->pruss, PRUSS_MEM_DRAM0,
		&stmdev->pru0sram);
	if (ret) {
		dev_err(dev, "Unable to get PRUSS RAM 0.\n");
		goto fail_putmem0;
	}

	ret = pruss_request_mem_region(stmdev->pruss, PRUSS_MEM_DRAM1,
		&stmdev->pru1sram);
	if (ret) {
		dev_err(dev, "Unable to get PRUSS RAM 1.\n");
		goto fail_putmem1;
	}


	/***************************************************************************
	 * Load PRU firmware and start
	 **************************************************************************/
    pr_info("Setting up PRUs\n");
	ret = rproc_set_firmware(stmdev->pru0, stmdev->fw_data->fw_names[0]);
	if (ret) {
		dev_err(dev, "Failed to set PRU0 firmware %s: %d\n",
			stmdev->fw_data->fw_names[0], ret);
		goto fail_putmem1;
	}
    pr_info("PRU0 firmware loaded\n");

	ret = rproc_set_firmware(stmdev->pru1, stmdev->fw_data->fw_names[1]);
	if (ret) {
		dev_err(dev, "Failed to set PRU1 firmware %s: %d\n",
			stmdev->fw_data->fw_names[1], ret);
		goto fail_putmem1;
	}
    pr_info("PRU1 firmware loaded\n");

	ret = rproc_boot(stmdev->pru0);
	if (ret) {
		dev_err(dev, "Failed to boot PRU0: %d\n", ret);
		goto fail_putmem1;
	}
    pr_info("PRU0 boot successfull\n");

	ret = rproc_boot(stmdev->pru1);
	if (ret) {
		dev_err(dev, "Failed to boot PRU1: %d\n", ret);
		goto fail_shutdown_pru0;
	}
    pr_info("PRU1 boot successfull\n");

	// Register stm device
	ret = misc_register(&stmdev->miscdev);
	if (ret) {
		pr_err("Failed to register stm device\n");
		goto fail_shutdown_pru1;
	}
    pr_info("Driver registration successfull\n");

	// Link private data to device
	dev = stmdev->miscdev.this_device;
	dev_set_drvdata(dev, stmdev);
    pr_info("Link private data successfull\n");

	ret = sysfs_create_group(&dev->kobj, &stm_attr_group);
	if (ret) {
		dev_err(dev, "Sysfs creation failed.\n");
		goto faildereg;
	}
    pr_info("Sysfs creation successfull\n");

	stmdev->arm_pru0_share = stmdev->pru0sram.va + 0;
	stmdev->arm_pru1_share = stmdev->pru1sram.va + 0;

	if (stmdev->arm_pru0_share->magic == ARM_PRU0_SHARE_MAGIC)
		dev_info(dev, "Valid ARM-PRU0 share structure found\n");
	else {
		dev_err(dev, "PRU0 Firmware error! (Magic word not found)\n");
		ret = -1;
		goto faildereg;
	}

	if (stmdev->arm_pru1_share->magic == ARM_PRU1_SHARE_MAGIC) {
		dev_info(dev, "Valid ARM-PRU1 share structure found\n");
	} else {
		dev_err(dev, "PRU1 Firmware error! (Magic word not found)\n");
		ret = -1;
		goto faildereg;
	}


	// Check DMA capabilities
    if (!dma_set_coherent_mask(dev, DMA_BIT_MASK(64))) {
        dev_info(dev, "Using 64 bit DMA mask");
    } else if (!dma_set_coherent_mask(dev, DMA_BIT_MASK(32))) {
        dev_info(dev, "Using 32 bit DMA mask");
    } else if (dma_set_coherent_mask(dev, DMA_BIT_MASK(24))) {
		dev_err(dev, "Failed to set DMA mask\n");
		ret = -1;
        goto faildereg;
    } else {
        dev_info(dev, "Using 24 bit DMA mask");
    }

	CircularBufferInit(&stmdev->arm_pru1_share->pattern_buffer_ctx, 0, sizeof(struct scan_point));
	stmdev->pattern_buffer = NULL;
	stmdev->arm_pru1_share->pattern_buffer = NULL;
	pr_info("Initialized empty circular scan buffer");

	pr_info("Successfully loaded STM driver\n");
    return 0;

faildereg:
	misc_deregister(&stmdev->miscdev);
fail_shutdown_pru1:
	rproc_shutdown(stmdev->pru1);
fail_shutdown_pru0:
	rproc_shutdown(stmdev->pru0);
fail_putmem1:
	if (stmdev->pru1sram.va)
		pruss_release_mem_region(stmdev->pruss, &stmdev->pru1sram);
fail_putmem0:
	if (stmdev->pru0sram.va)
		pruss_release_mem_region(stmdev->pruss, &stmdev->pru0sram);
	pru_rproc_put(stmdev->pru1);
fail_pruss_put:
	pruss_put(stmdev->pruss);
fail_pru0_put:
	pru_rproc_put(stmdev->pru0);
fail:
	return ret;
}

static int stm_remove(struct platform_device *pdev) {
	struct stm_dev *stmdev = platform_get_drvdata(pdev);
	struct device *dev = stmdev->miscdev.this_device;

	/* Remove the sysfs attributes */
	sysfs_remove_group(&dev->kobj, &stm_attr_group);

	/* Unregister the misc device */
	misc_deregister(&stmdev->miscdev);

	/* Shutdown the PRUs */
	dev_info(dev, "Shutting down PRUs\n");
	rproc_shutdown(stmdev->pru1);
	rproc_shutdown(stmdev->pru0);

	/* Release handles to PRUSS memory regions */
	pruss_release_mem_region(stmdev->pruss, &stmdev->pru0sram);
	pruss_release_mem_region(stmdev->pruss, &stmdev->pru1sram);
	pru_rproc_put(stmdev->pru1);
	pruss_put(stmdev->pruss);
	pru_rproc_put(stmdev->pru0);

	printk("STM driver unloaded\n");
	return 0;
}

static struct platform_driver stm_platform_driver = {
	.probe      = stm_probe,
	.remove     = stm_remove,
	.driver     = {
		.name   = DRV_NAME,
		.of_match_table = stm_dt_ids
	},
};

module_platform_driver(stm_platform_driver);

MODULE_LICENSE("GPL");
MODULE_VERSION(DRV_VERSION);
