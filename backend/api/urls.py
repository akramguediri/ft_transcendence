from django.urls import path

from . import views

urlpatterns = [
    path("", views.getAllStudents, name="getAllStudents"),
    path("csrf", views.csrf, name="csrf"),
    path("getStudent", views.getStudent, name="getStudent"),
    path("updateStudent", views.updateStudent, name="updateStudent"),
    path("updateName", views.updateName, name="updateName"),
]
