from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.exceptions import ValidationError
import json, os , requests
from .models import MyUser
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import MyUser, Friend, Notification
from dotenv import load_dotenv

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

load_dotenv()

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
HTTP_METHOD = os.getenv('HTTP_METHOD', 'http')
HOST_NAME = os.getenv('HOST_NAME', '10.13.8.3')
REACT_PORT = os.getenv('REACT_PORT', '3000')

# Construct the REDIRECTION_URL dynamically
REDIRECTION_URL = f"{HTTP_METHOD}://{HOST_NAME}:{REACT_PORT}/home-page"



@csrf_exempt
def getToken(request):
    try:
        # Parse the request body
        code_data = json.loads(request.body.decode("utf-8"))
        code = code_data.get('code')
        if not code:
            return JsonResponse({'error': 'Missing "code" parameter'}, status=400)

        # Prepare the request to the 42 API
        url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'redirect_uri': REDIRECTION_URL
        }

        # Make the request to the 42 API
        response = requests.post(url, data=data)
        token_data = response.json()

        # Return the token data
        return JsonResponse(token_data)

    except Exception as e:
        return JsonResponse({'error': 'An error occurred while processing the request'}, status=500)


@csrf_exempt
def getUserInfo(request):

    try:
        
        # Parse the request body to get the access token 
        token = json.loads(request.body.decode("utf-8"))
        
        if not token.get('access_token'):
            return JsonResponse({'error': 'Missing "access_token" parameter'}, status=400)

        # Fetch user info from the 42 API
        url = 'https://api.intra.42.fr/v2/me'
        headers = {'Authorization': f'Bearer {token["access_token"]}'}
        response = requests.get(url, headers=headers)
        user_data = response.json()

        # Check if the API returned an error
        if 'error' in user_data:
            return JsonResponse({'error': user_data['error_description']}, status=400)

        # Create or fetch the user from your database
        user = get_or_create_user(user_data, token["access_token"])
        if not user:
            return JsonResponse({'error': 'User already exists or could not be created'}, status=400)
          # Log the user in
        login(request, user)
        # Serialize the user data
        serialized_user_data = serialize_user(user)

        # Return the user data
        return JsonResponse(serialized_user_data, safe=False)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except requests.RequestException as e:
        return JsonResponse({'error': f'Failed to communicate with 42 API: {str(e)}'}, status=500)

def get_or_create_user(user_data, access_token):
    # Extract relevant user data from the 42 API response
    email = user_data.get('email')
    login = user_data.get('login')
    first_name = user_data.get('first_name')
    last_name = user_data.get('last_name')

    # Get the custom user model
    User = get_user_model()

    # Create or update the user
    user, created = User.objects.get_or_create(
        user_name=login,
        defaults={
            'name': f"{first_name} {last_name}",
            'email': email,
            'access_token': access_token  # Store the access token
        }
    )

    if not created:
        # Update the user's access token if they already exist
        user.access_token = access_token
        user.save()

    return user

def serialize_user(user):
    return {
        'user_name': user.user_name,
        'name': user.name,
        'email': user.email,
        'description': user.description,
        'avatar': user.avatar.url if user.avatar else None,
    }


@csrf_exempt
@login_required
def update_avatar(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'msg': 'User not authenticated'}, status=401)

    try:
        # Check if a file is included in the request
        if 'avatar' not in request.FILES:
            return JsonResponse({'status': 'error', 'msg': 'No avatar file provided'}, status=400)

        # Get the uploaded file
        avatar_file = request.FILES['avatar']

        # Update the avatar of the authenticated user
        request.user.avatar = avatar_file
        request.user.save()

        # Return the new avatar URL
        avatar_url = request.user.avatar.url

        return JsonResponse({
            'status': 'success',
            'msg': 'Avatar updated successfully!',
            'avatar_url': avatar_url  # Include the avatar URL in the response
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)
    

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

        # Get the avatar URL if it exists, otherwise use a default
        avatar_url = user.avatar.url if user.avatar else '/media/Avatars/default-avatar.png'

        return JsonResponse({
            'status': 'success',
            'msg': 'Login successful.',
            'user': {
                'id': user.id,
                'user_name': user.user_name,
                'name': user.name,
                'avatar': avatar_url,
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
            "avatar": request.build_absolute_uri(user.avatar.url) if user.avatar else request.build_absolute_uri('/media/Avatars/default-avatar.png')
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

@login_required
def fetch_user_friends(request):
    if request.method != "GET":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        friends = Friend.objects.filter(user=user, is_blocked=False, status='accepted')
        friend_list = [
            {
                'id': friend.friend.id,
                'name': friend.friend.name,
                'description': friend.friend.description,
                'avatar': friend.friend.avatar.url if friend.friend.avatar else None,
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
def add_friend(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        friend_user = MyUser.objects.filter(id=user_id).first()
        if not friend_user:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        existing_friendship = Friend.objects.filter(user=user, friend=friend_user).exists()
        if existing_friendship:
            return JsonResponse({'status': 'error', 'msg': 'Already friends'}, status=400)

        Friend.objects.create(user=user, friend=friend_user, is_blocked=False, status='pending')
        Notification.objects.create(user=friend_user, message=f"{user.name} sent you a friend request.")

        return JsonResponse({
            'status': 'success',
            'msg': 'Friend request sent successfully',
            'data': {
                'user_id': user_id
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
def accept_friend_request(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        request_id = data.get('request_id')

        if not request_id:
            return JsonResponse({'status': 'error', 'msg': 'Request ID not provided'}, status=400)

        # Debugging: Print the request_id and user
        print(f"Request ID: {request_id}, User: {user}")

        # Check the friend request
        friendship = Friend.objects.filter(id=request_id, friend=user, status='pending').first()
        if not friendship:
            print(f"No pending request found for User: {user} with Request ID: {request_id}")
            return JsonResponse({'status': 'error', 'msg': 'Friend request not found'}, status=404)

        friendship.status = 'accepted'
        friendship.save()
        
        return JsonResponse({'status': 'success', 'msg': 'Friend request accepted'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)
    
@login_required
def fetch_friend_requests(request):
    if request.method != "GET":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        requests = Friend.objects.filter(friend=user, status='pending')
        request_list = [
            {
                'id': request.user.id,
                'name': request.user.name,
                'description': request.user.description,
                'avatar': request.user.avatar.url if request.user.avatar else None,
            }
            for request in requests
        ]

        return JsonResponse({
            'status': 'success',
            'data': {
                'requests': request_list
            }
        })

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)

@login_required
def reject_friend_request(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        request_id = data.get('request_id')

        if not request_id:
            return JsonResponse({'status': 'error', 'msg': 'Request ID not provided'}, status=400)

        friendship = Friend.objects.filter(id=request_id, friend=user, status='pending').first()
        if not friendship:
            return JsonResponse({'status': 'error', 'msg': 'Friend request not found'}, status=404)

        friendship.delete()

        return JsonResponse({'status': 'success', 'msg': 'Friend request rejected'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'msg': 'An error occurred', 'err': [str(e)]}, status=500)


@login_required
def remove_friend(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'user_not_found'}, status=404)

        friendship = Friend.objects.filter(user=user, friend_id=user_id).first()
        # if not friendship:
        #     return JsonResponse({'status': 'error', 'msg': 'Friendship not found'}, status=404)

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
def block_user(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        target_user = MyUser.objects.filter(id=user_id).first()
        if not target_user:
            return JsonResponse({'status': 'error', 'msg': 'User not found'}, status=404)

        blocked_entry = Friend.objects.filter(user=user, friend=target_user, is_blocked=True).first()
        if blocked_entry:
            return JsonResponse({'status': 'error', 'msg': 'User is already blocked'}, status=400)

        Friend.objects.filter(user=user, friend=target_user, is_blocked=False).delete()

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
def unblock_user(request):
    if request.method != "POST":
        return JsonResponse({'status': 'error', 'msg': 'Invalid method'}, status=405)

    try:
        user = request.user
        data = json.loads(request.body)
        user_id = data.get('user_id')

        if not user_id:
            return JsonResponse({'status': 'error', 'msg': 'user_not_found'}, status=404)

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
