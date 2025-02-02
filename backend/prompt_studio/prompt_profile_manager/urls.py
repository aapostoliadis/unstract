from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import ProfileManagerView

profile_manager_list = ProfileManagerView.as_view({"post": "create"})
profile_manager_detail = ProfileManagerView.as_view(
    {
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }
)


urlpatterns = format_suffix_patterns(
    [
        path(
            "profile-manager/",
            profile_manager_list,
            name="profile-manager-list",
        ),
        path(
            "profile-manager/<uuid:pk>/",
            profile_manager_detail,
            name="profile-manager-detail",
        ),
    ]
)
