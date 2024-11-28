from django.http import JsonResponse
from django.middleware.csrf import get_token
from api.models import Student
from django.core import serializers
import sys, json
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from api.models import User  # Assuming `User` is the model name


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

@csrf_exempt  # Allows the endpoint to be tested without CSRF validation
def fetch_user_by_id(request):
    """
    Fetches user data by user ID.
    """
    if request.method != "POST":
        return JsonResponse({
            'msg': 'Invalid request method',
            'status': 'error',
            'err': ['Only POST requests are allowed']
        }, status=405)

    try:
        # Parse the JSON request body
        request_data = json.loads(request.body.decode('utf-8'))
        user_id = request_data.get('user_id')

        if not user_id:
            return JsonResponse({
                'msg': 'Missing user ID in request',
                'status': 'error',
                'err': ['user_id is required']
            }, status=400)

        # Fetch the user by ID
        user = User.objects.get(id=user_id)

        # Prepare the response data
        user_data = {
            'id': user.id,
            'name': user.name,
            'description': user.description,
            'avatar': user.avatar
        }

        return JsonResponse({
            'msg': 'User fetched successfully',
            'status': 'success',
            'data': {
                'user': user_data
            }
        }, status=200)

    except ObjectDoesNotExist:
        return JsonResponse({
            'msg': 'User not found',
            'status': 'error',
            'err': [f'No user found with id: {user_id}']
        }, status=404)
    except json.JSONDecodeError:
        return JsonResponse({
            'msg': 'Invalid JSON format',
            'status': 'error',
            'err': ['The request body must be a valid JSON']
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'msg': 'An unexpected error occurred',
            'status': 'error',
            'err': [str(e)]
        }, status=500)
