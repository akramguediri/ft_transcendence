from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.core.exceptions import ValidationError
import json
from .models import MyUser
from django.contrib.auth import authenticate, login, logout

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def getAllUsers(request):
    if request.method != "GET":
        return JsonResponse({'message': 'POSTResponse'})
    users = MyUser.objects.all()
    users_list = list(users.values())
    return JsonResponse(users_list, safe=False) 


def loginUser(request):
    if request.method != "POST":
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid request method. Only POST is allowed.',
        }, status=405)

    try:
        data = json.loads(request.body)
        user_name = data.get('user_name')
        password = data.get('password')

        if not user_name or not password:
            return JsonResponse({
                'status': 'error',
                'msg': 'Missing user_name or password in the request.'
            }, status=400)

        user = authenticate(request, username=user_name, password=password)
        if user is None:
            return JsonResponse({
                'status': 'error',
                'msg': 'Invalid username or password.'
            }, status=401)

        login(request, user)
        return JsonResponse({
            'status': 'success',
            'msg': 'Login successful.',
            'user': {
                'id': user.id,
                'user_name': user.user_name,
                'name': user.name,
            }
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid JSON format.',
        }, status=400)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An unexpected error occurred.',
            'err': [str(e)]
        }, status=500)


def logoutUser(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({'status': 'success', 'msg': 'Logged out successfully'})
        else:
            return JsonResponse({'status': 'error', 'msg': 'User is not authenticated'}, status=401)
    return JsonResponse({'status': 'error', 'msg': 'Invalid request method. Only POST is allowed.'}, status=405)

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
        if MyUser.objects.filter(user_name=user_name).exists():
            return JsonResponse({
                'status': 'error',
                'msg': 'User already exists',
            }, status=400)

        # Use the custom user manager to create the user (handles hashing automatically)
        new_user = MyUser.objects.create_user(
            user_name=user_name,
            password=password,
            name=name
        )

        return JsonResponse({
            'status': 'success',
            'msg': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'user_name': new_user.user_name,
                'name': new_user.name
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid JSON format',
        }, status=400)
    except ValidationError as ve:
        return JsonResponse({
            'status': 'error',
            'msg': 'Validation error',
            'err': list(ve.messages)
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An unexpected error occurred',
            'err': [str(e)]
        }, status=500)
    

def updateName(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'msg': 'User not authenticated'}, status=401)

    try:
        data = json.loads(request.body)
        new_name = data.get('new_name')

        if not new_name:
            return JsonResponse({'status': 'error', 'msg': 'New name is required'}, status=400)

        # Update the name of the authenticated user
        request.user.name = new_name
        request.user.save()

        return JsonResponse({'status': 'success', 'msg': 'User name updated successfully!'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)
    
    
def updatePassword(request):
    if request.method != "POST":
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid request method. Only POST is allowed.',
        }, status=405)

    try:
        # Parse request data
        data = json.loads(request.body.decode('utf-8'))
        old_pwd = data.get('old_pwd')
        new_pwd = data.get('new_pwd')
        new_pwd_confirm = data.get('new_pwd_confirm')

        # Validate required fields
        if not old_pwd or not new_pwd or not new_pwd_confirm:
            return JsonResponse({
                'status': 'error',
                'msg': 'Missing required fields',
                'err': ['old_pwd, new_pwd, and new_pwd_confirm are required.']
            }, status=400)

        # Check if new passwords match
        if new_pwd != new_pwd_confirm:
            return JsonResponse({
                'status': 'error',
                'msg': 'New passwords do not match.',
                'err': ['new_pwd and new_pwd_confirm must match.']
            }, status=400)

        # Verify the user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({
                'status': 'error',
                'msg': 'User not authenticated.',
                'err': ['User must be logged in to update their password.']
            }, status=401)

        # Authenticate user with the old password
        user = authenticate(request, user_name=request.user.user_name, password=old_pwd)
        if user is None:
            return JsonResponse({
                'status': 'error',
                'msg': 'Incorrect old password.',
                'err': ['Invalid old password.']
            }, status=400)

        # Update the user's password
        user.set_password(new_pwd)
        user.save()

        return JsonResponse({
            'status': 'success',
            'msg': 'Password updated successfully.',
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'msg': 'Invalid JSON format.',
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'msg': 'An unexpected error occurred.',
            'err': [str(e)]
        }, status=500)