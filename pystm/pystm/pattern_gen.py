import numpy as np

class Pattern:
    def __init__(self, x, y):
        assert len(x) == len(y)
        self.x = np.array(x)
        self.y = np.array(y)

    def get_point_count(self):
        return len(self.x)

    def get_point_array(self):
        points = []
        for i in range(len(self.x)):
            points.append((self.x[i], self.y[i]))
        return points

    def translate(self, x, y):
        self.x = self.x + x
        self.y = self.y + y
        return self

    def scale(self, x, y):
        self.x = self.x * x
        self.y = self.y * y
        return self

    def rotate(self, angle):
        x = np.cos(np.deg2rad(-angle))*self.x - np.sin(np.deg2rad(-angle))*self.y
        y = np.sin(np.deg2rad(-angle))*self.x + np.cos(np.deg2rad(-angle))*self.y

        self.x = x
        self.y = y
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
