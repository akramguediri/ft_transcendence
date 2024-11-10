from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie


@ensure_csrf_cookie
def index(request):
    return JsonResponse({'message': 'test'})
