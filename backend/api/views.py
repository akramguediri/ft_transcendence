from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from api.models import Student
from django.core import serializers


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

def index(request):
    if request.method == "GET":
        return JsonResponse({'message': 'GETResponse'})
    return JsonResponse({'message': 'POSTResponse'})

def updateStudent(request):
    if request.method != "POST":
        return JsonResponse({'message': 'Invalid method'})
    if (Student.objects.filter(pk = '1')):
        return JsonResponse({'message': 'Student already exists!'})
    else:
        obj = Student(name="ExampleStudent");
        obj.save()
    return JsonResponse({'message': 'Student updated!'})

def getStudent(request):
    if request.method != "GET":
        return JsonResponse({'message': 'Invalid method'})
    studentObject = Student.objects.filter(pk = "1"); 
    data = serializers.serialize("json", studentObject)
    return JsonResponse({'message': data })
