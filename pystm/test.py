from pystm.stm import STM
from pystm.pattern_gen import PatternGen

stm = STM()
stm.set_scan_enable(False)
stm.set_pattern_buffer_size(512)
stm.set_scan_enable(True)

pat = PatternGen.spiral(10,200)
#pat = PatternGen.triangle(5,100)
#pat = PatternGen.sine(5,200)

stm.write_pattern(pat.get_buffer_data())

#stm.set_scan_enable(False)
