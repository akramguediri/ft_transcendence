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
    path('isblocked', views.is_blocked, name='is_blocked'),
    path('addfriend', views.add_friend, name='add_friend'),
    path('removefriend', views.remove_friend, name='remove_friend'),
    path('blockuser', views.block_user, name='block_user'),
    path('unblockuser', views.unblock_user, name='unblock_user'),
    path('fetchblockedusers', views.fetch_blocked_users, name='fetch_blocked_users'),
]
