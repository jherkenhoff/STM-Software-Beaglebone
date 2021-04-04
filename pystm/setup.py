
from setuptools import find_packages, setup


# Where the magic happens:
setup(
    name="pystm",
    version="0.1.0",
    description="Python library for controlling the scanning tunneling microscope",
    author="mr-kenhoff",
    python_requires='>=3.6.0',
    url="https://github.com/mr-kenhoff/STM-Software-Beaglebone",
    packages=find_packages(exclude=['tests*']),
)
