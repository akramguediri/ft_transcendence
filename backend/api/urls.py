from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("csrf", views.csrf, name="csrf"),
    path("getStudent", views.getStudent, name="getStudent"),
    path("updateStudent", views.updateStudent, name="updateStudent"),
]
