



# Development enviroment

I decided against a cross-compilation setup.

Install and start FTP on beaglebone:
```

```



https://github.com/PierrickRauby/PRU-RPMsg-Setup-BeagleBoneBlack


# Sysfs path

`/sys/class/misc/stm/`
`/sys/devices/virtual/misc/stm/`

# Common commands

```
echo 10 | sudo tee /sys/class/misc/stm/dac_z
```
