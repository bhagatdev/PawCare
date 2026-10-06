from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer

class PostListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all().annotate(
            annotated_likes_count=Count('likes', distinct=True),
            annotated_comments_count=Count('comments', distinct=True)
        ).select_related('author', 'pet').prefetch_related('comments__author')

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PostSerializer
    queryset = Post.objects.all().select_related('author', 'pet').prefetch_related('comments__author')


class PostToggleLikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like_instance = Like.objects.filter(post=post, user=request.user)
        if like_instance.exists():
            like_instance.delete()
            is_liked = False
        else:
            Like.objects.create(post=post, user=request.user)
            is_liked = True

        return Response({
            'is_liked': is_liked,
            'total_likes': post.likes.count()
        }, status=status.HTTP_200_OK)


class CommentCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = Post.objects.get(id=post_id)
        serializer.save(author=self.request.user, post=post)
