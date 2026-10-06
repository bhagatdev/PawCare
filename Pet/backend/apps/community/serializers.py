from rest_framework import serializers
from .models import Post, Comment, Like
from apps.accounts.serializers import PetSerializer

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_avatar = serializers.ImageField(source='author.avatar', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'author_name', 'author_avatar', 'content', 'created_at')
        read_only_fields = ('id', 'author', 'created_at')


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_avatar = serializers.ImageField(source='author.avatar', read_only=True)
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    pet_breed = serializers.CharField(source='pet.breed', read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'author', 'author_name', 'author_avatar',
            'pet', 'pet_name', 'pet_breed', 'title', 'content',
            'category', 'image', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'comments', 'is_liked_by_user'
        )
        read_only_fields = ('id', 'author', 'created_at', 'updated_at')

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
