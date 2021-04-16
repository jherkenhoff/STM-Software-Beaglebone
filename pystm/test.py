from pystm.stm import STM
from pystm.pattern_gen import PatternGen, Pattern

import numpy as np

stm = STM()
stm.set_scan_enable(False)
stm.set_pattern_buffer_size(512)
stm.set_scan_buffer_size(512)
stm.set_scan_enable(True)

#pat = PatternGen.spiral(10, 10)
pat = Pattern([1,2,3,4], [5,6,7,8])
#pat = PatternGen.sine(5,200)

# Empty the scan buffer in order to "synchronize" pattern and scan buffer
while 1:
    read_cnt, buf = stm.read_scan()
    if read_cnt == 0:
        break

stm.set_scan_enable(True)

written_points = 0
adc = np.array([])
z = np.array([])

while 1:
    if written_points < pat.get_point_count():
        written_points = written_points + stm.write_pattern(pat, written_points)
    read_cnt, buf = stm.read_scan()
    adc = np.concatenate([adc, buf["adc"]])
    z = np.concatenate([z, buf["z"]])

    if len(adc) == pat.get_point_count():
        break

print(adc)
print(z)
