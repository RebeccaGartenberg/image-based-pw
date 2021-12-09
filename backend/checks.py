from PIL import Image
import numpy as np
import os

PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
IMAGES_DIR = "images"


def check_existence(image_file):
    image_path = os.path.join(PROJECT_DIR, IMAGES_DIR, image_file)
    return image_path if os.path.exists(image_path) else False


def check_bounds(image_path, x, y):
    if x < 0 or y < 0:
        return False

    image = np.asarray(Image.open(image_path))
    x_max, y_max, _ = image.shape
    if x >= x_max or y >= y_max:
        return False

    return True


def get_radial_distance(password_point, provided_point):
    password_x, password_y = password_point
    provided_x, provided_y = provided_point
    return abs(password_x - provided_x) + abs(password_y - provided_y)


def get_midpoint(point1, point2):
    p1_x, p1_y = point1
    p2_x, p2_y = point2

    mid_x = int((p1_x + p2_x) / 2)
    mid_y = int((p1_y + p2_y) / 2)
    return mid_x, mid_y
