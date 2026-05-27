
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import deque
from flask import send_from_directory
import os

app = Flask(__name__)
app.static_folder = '../dist'
CORS(app)

students = []
deleted_stack = []
request_queue = deque()

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/")
def home():
    return {"message": "Student Management Backend Running"}

@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)

@app.route("/students", methods=["POST"])
def add_student():
    data = request.json

    for s in students:
        if s["id"] == data["id"]:
            return jsonify({"error": "Student ID already exists"}), 400

    student = {
        "id": data["id"],
        "name": data["name"],
        "age": data["age"],
        "course": data["course"],
        "marks": data["marks"],
        "attendance": []
    }

    students.append(student)
    return jsonify(student), 201

@app.route("/students/<student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.json

    for s in students:
        if str(s["id"]) == student_id:
            s.update(data)
            return jsonify(s)

    return jsonify({"error": "Student not found"}), 404

@app.route("/students/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    for s in students:
        if str(s["id"]) == student_id:
            deleted_stack.append(s)
            students.remove(s)
            return jsonify({"message": "Student deleted"})

    return jsonify({"error": "Student not found"}), 404

@app.route("/undo-delete", methods=["POST"])
def undo_delete():
    if deleted_stack:
        student = deleted_stack.pop()
        students.append(student)
        return jsonify(student)

    return jsonify({"message": "No deleted records"})

@app.route("/attendance/<student_id>", methods=["POST"])
def mark_attendance(student_id):
    data = request.json

    for s in students:
        if str(s["id"]) == student_id:
            attendance = {
                "status": data["status"],
                "date": data["date"]
            }

            s["attendance"].append(attendance)

            return jsonify({
                "studentId": student_id,
                "status": data["status"],
                "date": data["date"]
            })

    return jsonify({"error": "Student not found"}), 404

@app.route("/requests", methods=["POST"])
def add_request():
    data = request.json
    request_queue.append(data["request"])
    return jsonify({"message": "Request added"})

@app.route("/requests/process", methods=["POST"])
def process_request():
    if request_queue:
        req = request_queue.popleft()
        return jsonify({"processed": req})

    return jsonify({"message": "No requests"})

if __name__ == "__main__":
    app.run(debug=True)
