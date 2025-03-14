from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
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



@login_required
def updateName(request):
    if request.method != "POST":
        return JsonResponse({'msg': 'Invalid method'}, status=405)

    try:
        # Parse the request body
        requestData = json.loads(request.body.decode("utf-8"))
        new_name = requestData.get('new_name')

        # Validate the new name
        if not new_name:
            return JsonResponse({'message': 'New name is required'}, status=400)

        # Update the name of the logged-in user
        user = request.user
        user.first_name = new_name  # Adjust if you use a custom user model
        user.save()

        return JsonResponse({
            'status': 'success',
            'message': 'User name updated successfully!'
        }, status=200)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An error occurred.',
            'err': [str(e)]
        }, status=500)

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import GameRecord

@method_decorator(csrf_exempt, name='dispatch')
class SaveGameRecord(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            game_record = GameRecord(
                game_id=data.get('gameId'),
                player1=data.get('player1'),
                player2=data.get('player2'),
                result=data.get('result'),
                winner=data.get('winner'),
                loser=data.get('loser'),
                game_mode=data.get('gameMode'),
                ball_size=data['settings']['ballSize'],
                paddle_speed=data['settings']['paddleSpeed'],
                max_score=data['settings']['maxScore'],
                game_duration=data['settings']['gameDuration'],
            )
            game_record.save()

            return JsonResponse({'status': 'success', 'message': 'Game record saved successfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)