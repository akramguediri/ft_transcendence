from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
import json
from .models import MyUser
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.utils.decorators import method_decorator
from .models import MyUser, Friend

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def fetchUsers(request):
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
                'avatar': user.avatar,
                'description': user.description,
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

@csrf_exempt  # Disable CSRF protection for testing (not recommended for production)
def fetchUserById(request):
    if request.method != "POST":
        return JsonResponse({"msg": "Invalid request method", "status": "error"}, status=405)

    try:
        body = json.loads(request.body)
        user_id = body.get('user_id')

        if not user_id:
            return JsonResponse({"msg": "User ID is required", "status": "error"}, status=400)

        user = MyUser.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({"msg": "User not found", "status": "error"}, status=404)

        user_data = {
            "id": user.id,
            "name": user.name,
            "description": user.description,
            "avatar": user.avatar
        }
        return JsonResponse({"msg": "User fetched successfully", "status": "success", "data": {"user": user_data}})
    except json.JSONDecodeError:
        return JsonResponse({"msg": "Invalid JSON payload", "status": "error"}, status=400)

def updatePassword(request):
    if request.method == "POST":
        data = json.loads(request.body)
        old_pwd = data.get("old_pwd")
        new_pwd = data.get("new_pwd")
        new_pwd_confirm = data.get("new_pwd_confirm")

        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'msg': 'User is not authenticated'}, status=401)

        if new_pwd != new_pwd_confirm:
            return JsonResponse({'status': 'error', 'msg': 'Passwords do not match'}, status=400)

        user = request.user
        if not user.check_password(old_pwd):
            return JsonResponse({'status': 'error', 'msg': 'Old password is incorrect'}, status=400)

        user.set_password(new_pwd)
        user.save()
        logout(request)
        return JsonResponse({'status': 'success', 'msg': 'Password updated and logged out successfully'}, status=200)

    return JsonResponse({'status': 'error', 'msg': 'Invalid request method. Only POST is allowed.'}, status=405)    

def updateDescription(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'msg': 'User not authenticated'}, status=401)

    try:
        data = json.loads(request.body)
        new_description = data.get('new_description')

        if not new_description:
            return JsonResponse({'status': 'error', 'msg': 'New description is required'}, status=400)

        # Update the description of the authenticated user
        request.user.description = new_description
        request.user.save()

        return JsonResponse({'status': 'success', 'msg': 'User description updated successfully!'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
@csrf_protect
def update_avatar(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        new_avatar_url = data.get('new_avatar_url')

        if not new_avatar_url:
            return JsonResponse({'status': 'error', 'msg': 'New avatar URL is required'}, status=400)

        user.avatar = new_avatar_url
        user.save()

        return JsonResponse({
            'status': 'success',
            'msg': 'Avatar updated successfully',
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@csrf_protect
@login_required
def fetch_user_friends(request):
    if request.method != "GET":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        friends = Friend.objects.filter(user=user, is_blocked=False)
        friend_list = [
            {
                'id': friend.friend.id,
                'name': friend.friend.name,
                'description': friend.friend.description,
                'avatar': friend.friend.avatar,
            }
            for friend in friends
        ]

        return JsonResponse({
            'status': 'success',
            'data': {
                'friends': friend_list
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
@csrf_protect
def is_blocked(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)  # Parse request body
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User ID is required'}, status=400)

        # Check if the user_id is in the current user's blocklist
        is_blocked = Friend.objects.filter(user=user, friend_id=user_id, is_blocked=True).exists()

        return JsonResponse({
            'status': 'success',
            'data': {
                'user_id': user_id,
                'is_blocked': is_blocked
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@csrf_protect
@login_required
def fetch_user_friends(request):
    if request.method != "GET":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        friends = Friend.objects.filter(user=user, is_blocked=False)
        friend_list = [
            {
                'id': friend.friend.id,
                'name': friend.friend.name,
                'description': friend.friend.description,
                'avatar': friend.friend.avatar,
            }
            for friend in friends
        ]

        return JsonResponse({
            'status': 'success',
            'data': {
                'friends': friend_list
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)
    
@login_required
@csrf_protect
def add_friend(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User ID is required'}, status=400)

        friend_user = MyUser.objects.filter(id=user_id).first()
        if not friend_user:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        is_blocked = Friend.objects.filter(user=friend_user, friend=user, is_blocked=True).exists()
        if is_blocked:
            return JsonResponse({'status': 'error', 'msg': 'You are blocked by this user'}, status=403)

        existing_friendship = Friend.objects.filter(user=user, friend=friend_user).exists()
        if existing_friendship:
            return JsonResponse({'status': 'error', 'msg': 'Already friends'}, status=400)

        Friend.objects.create(user=user, friend=friend_user, is_blocked=False)

        return JsonResponse({
            'status': 'success',
            'msg': 'Friend added successfully',
            'data': {
                'user_id': user_id
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
@csrf_protect
def remove_friend(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User ID is required'}, status=400)

        friendship = Friend.objects.filter(user=user, friend_id=user_id).first()
        if not friendship:
            return JsonResponse({'status': 'error', 'msg': 'Friendship not found'}, status=404)

        friendship.delete()

        return JsonResponse({
            'status': 'success',
            'msg': 'Friend removed successfully',
            'data': {
                'user_id': user_id
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)
    
@login_required
@csrf_protect
def block_user(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)  # Parse request body
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User ID is required'}, status=400)

        # Ensure the user exists
        target_user = MyUser.objects.filter(id=user_id).first()
        if not target_user:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        # Check if the user is already blocked
        friendship = Friend.objects.filter(user=user, friend=target_user).first()
        if friendship and friendship.is_blocked:
            return JsonResponse({'status': 'error', 'msg': 'User is already blocked'}, status=400)

        # Block the user
        if friendship:
            friendship.is_blocked = True
            friendship.save()
        else:
            Friend.objects.create(user=user, friend=target_user, is_blocked=True)

        return JsonResponse({
            'status': 'success',
            'msg': 'User blocked successfully',
            'data': {
                'user_id': user_id
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
@csrf_protect
def unblock_user(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User ID is required'}, status=400)

        target_user = MyUser.objects.filter(id=user_id).first()
        if not target_user:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        friendship = Friend.objects.filter(user=user, friend=target_user, is_blocked=True).first()
        if not friendship:
            return JsonResponse({'status': 'error', 'msg': 'User is not in your blocklist'}, status=400)

        friendship.is_blocked = False
        friendship.save()

        return JsonResponse({
            'status': 'success',
            'msg': 'User unblocked successfully',
            'data': {
                'user_id': user_id
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
@csrf_protect
def fetch_blocked_users(request):
    if request.method != "GET":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user

        blocked_users = Friend.objects.filter(user=user, is_blocked=True)
        blocked_users_list = [
            {
                'id': blocked.friend.id,
                'name': blocked.friend.name,
                'description': blocked.friend.description,
                'avatar': blocked.friend.avatar,
            }
            for blocked in blocked_users
        ]

        return JsonResponse({
            'status': 'success',
            'data': {
                'blocked_users': blocked_users_list
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)