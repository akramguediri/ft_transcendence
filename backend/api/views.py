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
    students = Student.objects.all();
    data = serializers.serialize("json", students)
    return JsonResponse({'message': data }, safe=False)

def updateStudent(request):
    requestData = json.loads(request.body.decode("utf-8"))
    if (requestData['name'] == []):
        return JsonResponse({'message': 'Empty name'})
    if request.method != "POST":
        return JsonResponse({'message': 'Invalid method'})
    if (Student.objects.filter(name = requestData['name'])):
        return JsonResponse({'message': 'Student already exists!'})
    else:
        obj = Student(name= requestData['name']);
        obj.save()
    return JsonResponse({'message': 'Student updated!'})

def getStudent(request):
    if request.method != "POST":
        return JsonResponse({'message': 'Invalid method'})
    requestData = json.loads(request.body.decode("utf-8"))
    studentObject = Student.objects.filter(name = requestData['name']); 
    data = serializers.serialize("json", studentObject)
    return JsonResponse({'message': data })

#this endpoint updates an existing username by passing the current name and the new_name
# {
#     "name": "anas",
#     "new_name": "ananas"
# }
def updateName(request):
    if request.method != "POST":
        return JsonResponse({'msg': 'Invalid method'},)
    requestData = json.loads(request.body.decode("utf-8"))
    name = requestData.get('name')
    new_name = requestData.get('new_name')
    if not new_name or not name:
        return JsonResponse({'message': 'Empty name or new name'})
    target_student = Student.objects.filter(name=name).first()
    if not target_student:
        return JsonResponse({'message': 'Student not found!'})
    target_student.name = new_name
    target_student.save()
    return JsonResponse({'message': 'Student name updated successfully!'})
