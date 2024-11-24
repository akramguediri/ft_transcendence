from django.contrib.auth.hashers import make_password, check_password
from usermanagement.models import User  # Import the User model
from django.http import JsonResponse
import json

def loginUser(request):
    if request.method != "GET":
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid request method. Only GET is allowed.',
        }, status=405)

    try:
        # Extract query parameters
        user_name = request.GET.get('user_name')
        password = request.GET.get('password')

        # Validate required fields
        if not user_name or not password:
            return JsonResponse({
                'status': 'error',
                'msg': 'Missing user_name or password in the request.'
            }, status=400)

        # Check if user exists
        try:
            user = User.objects.get(user_name=user_name)
        except User.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'msg': 'Invalid username or password.'
            }, status=401)

        # Check if the password matches
        if not check_password(password, user.password):
            return JsonResponse({
                'status': 'error',
                'msg': 'Invalid username or password.'
            }, status=401)

        # If successful, return user data
        return JsonResponse({
            'status': 'success',
            'msg': 'Login successful.',
            'user': {
                'id': user.id,
                'user_name': user.user_name,
                'name': user.name
            }
        }, status=200)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An unexpected error occurred.',
            'err': [str(e)]
        }, status=500)

def registerUser(request):
    if request.method != "POST":
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid request method. Only POST is allowed.',
        }, status=405)

    try:
        # Parse request data
        requestData = json.loads(request.body.decode("utf-8"))
        user_name = requestData.get('user_name')
        password = requestData.get('pwd')
        name = requestData.get('name', '')

        # Validate required fields
        if not user_name or not password:
            return JsonResponse({
                'status': 'error',
                'msg': 'Missing required fields',
                'err': ['user_name and pwd are required.']
            }, status=400)

        # Check if user already exists
        if User.objects.filter(user_name=user_name).exists():
            return JsonResponse({
                'status': 'error',
                'msg': 'User already exists',
            }, status=400)

        # Create and save new user
        new_user = User(
            user_name=user_name,
            name=name,
            password=make_password(password),  # Hash the password for security
        )
        new_user.save()

        return JsonResponse({
            'status': 'success',
            'msg': 'User registered successfully',
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid JSON format',
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An unexpected error occurred',
            'err': [str(e)]
        }, status=500)