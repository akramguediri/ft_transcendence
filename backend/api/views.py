from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from api.models import Student
from django.core import serializers
import sys, json


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def getAllStudents(request):
    if request.method != "GET":
        return JsonResponse({'message': 'POSTResponse'})
    students = Student.objects.all()
    students_list = list(students.values()) # Convert the queryset to a list
    return JsonResponse(students_list, safe=False) # Return the list as JSON

def updateStudent(request):
    if request.method != "POST":
        return JsonResponse({'message': 'Invalid method'}, status=405)

    try:
        requestData = json.loads(request.body.decode("utf-8"))

        # Extract required fields
        first_name = requestData.get('first_name')
        last_name = requestData.get('last_name')
        email = requestData.get('email')
        password = requestData.get('password')

        # Validate required fields
        if not first_name or not last_name or not email or not password:
            return JsonResponse({'message': 'Missing required fields'}, status=400)
        # Check if the student already exists by email
        student = Student.objects.filter(email=email).first()
        if student:
            # Update the existing student's information
            student.first_name = first_name
            student.last_name = last_name
            student.password = password  # Consider hashing this for security
            student.save()
            return JsonResponse({'message': 'Student updated successfully'}, status=200)
        else:
            # Create a new student
            new_student = Student(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password  # Consider hashing this for security
            )
            new_student.save()
            return JsonResponse({'message': 'Student created successfully'}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON format'}, status=400)
    except Exception as e:
        print(f"Unexpected error: {e}")
        return JsonResponse({'message': 'An unexpected error occurred'}, status=500)
        # Get all users

def getStudent(request):
    if request.method != "POST":
        return JsonResponse({'message': 'Invalid method'})
    requestData = json.loads(request.body.decode("utf-8"))
    studentObject = Student.objects.filter(name = requestData['name']); 
    data = serializers.serialize("json", studentObject)
    return JsonResponse({'message': data })
