from django.urls import path

from . import views

urlpatterns = [
    path("getAllUsers", views.getAllUsers, name="getAllUsers"),
    path("csrf", views.csrf, name="csrf"),
    path("register", views.registerUser, name="registerUser"),
    path("login", views.loginUser, name="loginUser"),
    path("logout", views.logoutUser, name="logoutUser"),
    path("updateName", views.updateName, name="updateName"),
    path("updatePassword", views.updatePassword, name="updatePassword"),
]
