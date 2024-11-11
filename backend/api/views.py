from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def index(request):
    if request.method == "GET":
        return JsonResponse({'message': 'GETResponse'})
    return JsonResponse({'message': 'POSTResponse'})
