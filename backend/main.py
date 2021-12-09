from .checks import check_existence, check_bounds, get_radial_distance, get_midpoint
from flask import Blueprint, jsonify, send_file, request
from werkzeug.utils import secure_filename
from flask_login import current_user
import os

PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
IMAGES_DIR = "images"

main = Blueprint("main", __name__)


RADIAL_DISTANCES = [5, 10, 50]


@main.route("/ping", methods=["GET"])
def ping():
    return jsonify("OK"), 200


@main.route("/", methods=["GET"])
def index():
    if current_user.is_authenticated:
        return jsonify(F"Hello {current_user.username}"), 200
    else:
        return jsonify("Please try our ECE455 - Cybersecurity Final Project!"), 200


@main.route("/get_image/<image>", methods=["GET"])
def get_image(image):
    file_path = check_existence(secure_filename(image))
    return (send_file(file_path), 200) if file_path else (jsonify("Requested Image Does Not Exist"), 404)


@main.route("/get_password_images", methods=["GET"])
def get_password_images():
    return jsonify(os.listdir(os.path.join(PROJECT_DIR, IMAGES_DIR))), 200


@main.route("/getR", methods=["GET"])
def get_radial_distances():
    return jsonify({"R": RADIAL_DISTANCES}), 200


"""

    Expected signup password format: 
        "<image_name> <tuple_of_coordinates>, <image_name> <tuple_of_coordinates>, ...;
        <image_name> <tuple_of_coordinates>, <image_name> <tuple_of_coordinates>, ..." 

    Signup password should be one continuous string. Each attempt (should be 2) should be semi-colon delimited. Within
    each attempt, each sequence of password 'points' should be the name of the image file, followed by a tuple of x, y
    coordinates delimited with a comma. There should be N signup strings, one for each of the R being tested.
    
    Total signup post request:
    
    {
        "username": <username>,
        "radial_distance": <radial_distance_user_wants_to_use>,
        "password": <expected_signup_password_string>
    }


"""
@main.route("/signup", methods=["POST"])
def signup():
    username = request.form.get("username")
    radial_distance = request.form.get("radial_distance")
    password = request.form.get("password")

    return jsonify(), 200


"""

    Expected login password format: 
        "<image_name> <tuple_of_coordinates>, <image_name> <tuple_of_coordinates>, ..." 

    Login password should be one continuous string. Each sequence of password 'points' should be the name of the image
    file, followed by a tuple of x, y coordinates delimited with a comma. Expecting one password string for a specified
    radial distance that the user would like to use/test for login.

    Total signup post request:

    {
        "username": <username>,
        "radial_distance": <radial_distance_user_wants_to_use>,
        "password": <expected_signup_password_string>,
    }


"""
@main.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    radial_distance = request.form.get("radial_distance")
    password = request.form.get("password")

    return jsonify(), 200
