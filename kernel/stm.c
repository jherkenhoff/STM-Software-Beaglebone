// https://lwn.net/Articles/448502/


#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/device.h>
#include <linux/platform_device.h>
#include <linux/miscdevice.h>
#include <linux/kobject.h>

#include <linux/pruss.h>
// #include <linux/pruss_intc.h>
#include <linux/remoteproc.h>

#include <linux/of.h>
#include <linux/of_platform.h>
#include <linux/of_address.h>
#include <linux/of_device.h>

#include <linux/sysfs.h>
#include <linux/fs.h>

#include "../pru/arm_pru0_share.h"
#include "../pru/arm_pru1_share.h"

#define DRV_NAME	"stm"
#define DRV_VERSION	"0.1"

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
	struct arm_pru0_share *arm_pru0_share;
	struct arm_pru1_share *arm_pru1_share;
	uint32_t samplerate;
};


/**** Device file operations **************************************************/
static int stm_f_open(struct inode *inode, struct file *filp) {
	return 0;
}

ssize_t stm_f_read (struct file *filp, char __user *buf, size_t sz, loff_t *offset) {
	return -EFAULT;
}

int stm_f_mmap(struct file *filp, struct vm_area_struct *vma) {
	return 0;
}

static long stm_f_ioctl(struct file *filp, unsigned int cmd, unsigned long arg) {
	return -ENOTTY;
}

static loff_t stm_f_llseek(struct file *filp, loff_t offset, int whence) {
	return -EINVAL;
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
	.unlocked_ioctl = stm_f_ioctl,
	.read = stm_f_read,
	.llseek = stm_f_llseek,
	.mmap = stm_f_mmap,
	.poll = stm_f_poll,
	.release = stm_f_release,
};


/**** Sysfs attributes ********************************************************/
static ssize_t adc_value_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru0_share->adc_value);
}

static ssize_t dac_x_manual_setpoint_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	if (kstrtoint(buf, 10, &stmdev->arm_pru1_share->dac_x_manual_setpoint))
		return -EINVAL;
	return count;
}

static ssize_t dac_x_manual_setpoint_show(struct device *dev, struct device_attribute *attr, char *buf) {
	struct stm_dev *stmdev = dev_get_drvdata(dev);
	return snprintf(buf, PAGE_SIZE, "%d", stmdev->arm_pru1_share->dac_x_manual_setpoint);
}

static ssize_t adc_averages_show(struct device *dev, struct device_attribute *attr, char *buf) {
	return snprintf(buf, PAGE_SIZE, "%d", 1);
}
static ssize_t adc_averages_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	return count;
}

static DEVICE_ATTR(adc_value, S_IRUGO, adc_value_show, NULL);
static DEVICE_ATTR(dac_x_manual_setpoint, S_IWUSR | S_IRUGO, dac_x_manual_setpoint_show, dac_x_manual_setpoint_store);
static DEVICE_ATTR(adc_averages, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_x_center, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_y_center, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_x_step, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_y_step, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_x_num, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(scan_y_num, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(loop_enable, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(loop_p_gain, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(loop_i_gain, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(loop_d_gain, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);
static DEVICE_ATTR(loop_adc_setpoint, S_IWUSR | S_IRUGO, adc_averages_show, adc_averages_store);

static struct attribute *stm_attributes[] = {
	&dev_attr_adc_value.attr,
	&dev_attr_dac_x_manual_setpoint.attr,
	&dev_attr_adc_averages.attr,
	&dev_attr_scan_x_center.attr,
	&dev_attr_scan_y_center.attr,
	&dev_attr_scan_x_step.attr,
	&dev_attr_scan_y_step.attr,
	&dev_attr_scan_x_num.attr,
	&dev_attr_scan_y_num.attr,
	&dev_attr_loop_enable.attr,
	&dev_attr_loop_p_gain.attr,
	&dev_attr_loop_i_gain.attr,
	&dev_attr_loop_d_gain.attr,
	&dev_attr_loop_adc_setpoint.attr,
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
		goto faildereg;
	}

	if (stmdev->arm_pru1_share->magic == ARM_PRU1_SHARE_MAGIC)
		dev_info(dev, "Valid ARM-PRU1 share structure found\n");
	else {
		dev_err(dev, "PRU1 Firmware error! (Magic word not found)\n");
		goto faildereg;
	}

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
		.name   = "stm",
		.of_match_table = stm_dt_ids
	},
};

module_platform_driver(stm_platform_driver);

MODULE_LICENSE("GPL");
