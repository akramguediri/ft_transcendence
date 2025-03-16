from django.urls import path
from . import views

urlpatterns = [
    path("fetchUsers", views.fetchUsers, name="fetchUsers"),
    path("csrf", views.csrf, name="csrf"),
    path("register", views.registerUser, name="registerUser"),
    path("login", views.loginUser, name="loginUser"),
    path("logout", views.logoutUser, name="logoutUser"),
    path("updateName", views.updateName, name="updateName"),
    path('fetchUserById', views.fetchUserById, name='fetchUserById'),
    path("updatePassword", views.updatePassword, name="updatePassword"),
    path("updateDescription", views.updateDescription, name="updateDescription"),
    path('updateAvatar', views.update_avatar, name='update_avatar'),
    path('fetchuserfriends', views.fetch_user_friends, name='fetch_user_friends'),
    path('addfriend', views.add_friend, name='add_friend'),
    path('get42token', views.getToken, name='get_42_token'),
    path('get42UserInfo', views.getUserInfo, name='Get42UserInfo'),
    path('gameRecords', views.save_game_record, name='save_game_record'),
    path('getGameRecords', views.fetch_game_records, name='fetch_game_records'),
    path('acceptfriendrequest', views.accept_friend_request, name='acceptfriendrequest'),
    path('rejectFriendRequest', views.reject_friend_request, name='reject_friend_request'),
    path('fetchfriendrequests', views.fetch_friend_requests, name='fetch_friend_requests'),
    path('fetchUserGameRecords', views.fetch_user_game_records, name='fetch-user-game-records'),
]
