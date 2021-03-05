import numpy as np

class Pattern:
    def __init__(self, x, y):
        assert len(x) == len(y)
        self.x = x
        self.y = y

    def get_buffer_data(self, dtype="int32", word_width=18):
        x = self.x.clip(-0.5, 0.5)
        y = self.y.clip(-0.5, 0.5)
        pattern = np.empty((len(self.x), 2), dtype=dtype)
        pattern[:,0] = (x*2) * (2**(word_width-1)-1)
        pattern[:,1] = (y*2) * (2**(word_width-1)-1)
        return pattern

    def translate(self, x, y):
        self.x = self.x + x
        self.y = self.y + y
        return self

    def scale(self, x, y):
        self.x = self.x * x
        self.y = self.y * y
        return self

    def rotate(self, angle):
        self.x = np.cos(angle)*self.x - np.sin(angle)*self.y
        self.y = np.sin(angle)*self.x + np.cos(angle)*self.y
        return self

class PatternGen:

    @staticmethod
    def triangle(n_lines, n_linepoints):
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

        return Pattern(x,y).translate(-0.5, -0.5)

    @staticmethod
    def sine(periods, points_per_period):
        y = np.linspace(0, 1, periods*points_per_period)-0.5
        x = np.sin(2*np.pi*y*periods)*0.5
        return Pattern(x,y)

    @staticmethod
    def cosine(periods, points_per_period):
        y = np.linspace(0, 1, periods*points_per_period)-0.5
        x = np.cos(2*np.pi*y*periods)*0.5
        return Pattern(x,y)

    @staticmethod
    def spiral(turns, points_per_turn):
        i = np.linspace(0, 1, points_per_turn*turns)
        x = np.sin(2*np.pi*np.sqrt(i)*turns)*0.5*np.sqrt(i)
        y = np.cos(2*np.pi*np.sqrt(i)*turns)*0.5*np.sqrt(i)
        return Pattern(x,y)
