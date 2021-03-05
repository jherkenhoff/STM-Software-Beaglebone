import numpy as np

stm_dev_file   = "/dev/stm"

def gen_triangle_pattern(n_lines, n_linepoints):
    line_pitch = 1/float(n_lines)

    single_line_x = np.linspace(0, 1, n_linepoints)
    single_line_y = np.linspace(0, line_pitch, n_linepoints)

    x = np.empty((0, ))
    y = np.empty((0, ))

    for i, offset in enumerate(np.linspace(0, 1, n_lines, endpoint=False)):
        s = 0 if i==0 else 1
        y = np.concatenate((y, single_line_y[s:]+offset))
        if i%2:
            x = np.concatenate((x, 1-single_line_x[s:]))
        else:
            x = np.concatenate((x, single_line_x[s:]))

    pattern = np.empty((len(x), 2), dtype="int32")
    pattern[:,0] = (x*2-1) * (2**15-1)
    pattern[:,1] = (y*2-1) * (2**15-1)
    return pattern

# t = np.linspace(0, 12*np.pi, 254)
#
# pattern = np.zeros((254, 2), dtype="int32")
# pattern[:,0] = np.sin(t)*(2**15-1)
# pattern[:,1] = np.cos(t)*(2**15-1)

pattern = gen_triangle_pattern(2, 2)


with open(stm_dev_file, "wb") as f:
    f.write(pattern)
