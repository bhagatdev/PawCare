from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    PostToggleLikeView,
    CommentCreateView,
)

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/<int:post_id>/like/', PostToggleLikeView.as_view(), name='post_toggle_like'),
    path('posts/<int:post_id>/comments/', CommentCreateView.as_view(), name='comment_create'),
]
