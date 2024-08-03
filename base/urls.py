from django.urls import path
from  .import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = [
    path('',views.lobby),
    path('room/',views.room),
    path('get_token/',views.getToken),
    path('create_member/',views.createMember),
    path('get_member/',views.getMember),
]
urlpatterns += staticfiles_urlpatterns()
