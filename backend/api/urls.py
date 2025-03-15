from django.urls import path

from . import views

urlpatterns = [
    path("getAllStudents", views.getAllStudents, name="getAllStudents"),
    path("csrf", views.csrf, name="csrf"),
    path("getStudent", views.getStudent, name="getStudent"),
    path("updateStudent", views.updateStudent, name="updateStudent"),
    path("updateName", views.updateName, name="updateName"),
    path('api/game-records/', SaveGameRecord.as_view(), name='save_game_record'),
]
