// https://lwn.net/Articles/448502/


#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/device.h>
#include <linux/platform_device.h>

#include <linux/miscdevice.h>
#include <linux/kobject.h>

#include <linux/of.h>
#include <linux/of_platform.h>
#include <linux/of_address.h>
#include <linux/of_device.h>

#include <linux/sysfs.h>
#include <linux/fs.h>

#define DRV_NAME	"stm"
#define DRV_VERSION	"0.1"

struct stm_dev {
	/* Misc device descriptor */
	struct miscdevice miscdev;

	/* Private data */
	struct device *p_dev; /* Parent platform device */

	/* Device capabilities */
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
	return snprintf(buf, PAGE_SIZE, "%d", 100);
}

static ssize_t adc_averages_show(struct device *dev, struct device_attribute *attr, char *buf) {
	return snprintf(buf, PAGE_SIZE, "%d", 1);
}
static ssize_t adc_averages_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
	return count;
}

static DEVICE_ATTR(adc_value, S_IRUGO, adc_value_show, NULL);
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


// Mapping between device tree node and driver
static const struct of_device_id stm_dt_ids[] = {
	{ .compatible = "stm,stm" },
	{ /* sentinel */ },
};
MODULE_DEVICE_TABLE(of, stm_dt_ids);

static int stm_probe(struct platform_device *pdev) {
	struct stm_dev *stmdev;
	struct device *dev;
	struct device_node *node = pdev->dev.of_node;
	const struct of_device_id *match;
	int ret;

    pr_info("STM Driver probe");

    // Check if device-tree is supported, else return
    if (!node) {
		pr_err("Device tree is not supported on this platform");
        return -ENODEV;
	}

    // Check if the device (pdev) is supported by this driver
    match = of_match_device(stm_dt_ids, &pdev->dev);
    if (!match) {
		pr_err("Device is not supported by this driver");
        return -ENODEV;
	}

	// Allocate memory for device structure
	stmdev = devm_kzalloc(&pdev->dev, sizeof(*stmdev), GFP_KERNEL);
	if (!stmdev) {
		pr_err("Failed to alloc memory for stmdev");
		ret = -1;
		goto fail;
	}
    pr_info("Memory alloc successfull");

	// Initialize stm device members
	//stmdev->fw_data = match->data;
	stmdev->miscdev.fops  = &stm_fops;
	stmdev->miscdev.minor = MISC_DYNAMIC_MINOR;
	stmdev->miscdev.mode  = S_IRUGO;
	stmdev->miscdev.name  = "stm";

	// Link the platform device data to our private structure
	stmdev->p_dev = &pdev->dev;
	dev_set_drvdata(stmdev->p_dev, stmdev);

	// Register stm device
	ret = misc_register(&stmdev->miscdev);
	if (ret) {
		pr_err("Failed to register stm device");
		goto fail;
	}
    pr_info("Driver registration successfull");

	// Link private driver to device
	dev = stmdev->miscdev.this_device;
	dev_set_drvdata(dev, stmdev);
    pr_info("Link private data successfull");

	ret = sysfs_create_group(&dev->kobj, &stm_attr_group);
	if (ret) {
		dev_err(dev, "Sysfs creation failed.");
		goto faildereg;
	}
    pr_info("Sysfs creation successfull");

	pr_info("Successfully loaded STM driver");
    return 0;

faildereg:
	misc_deregister(&stmdev->miscdev);
fail:
	return ret;
}

static int stm_remove(struct platform_device *pdev) {
	struct stm_dev *stmdev = platform_get_drvdata(pdev);
	struct device *dev = stmdev->miscdev.this_device;

	/* Remove the sysfs attributes */
	sysfs_remove_group(&dev->kobj, &stm_attr_group);

	/* Deregister the misc device */
	misc_deregister(&stmdev->miscdev);

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
