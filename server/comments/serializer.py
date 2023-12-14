from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['comment_text', 'comment_creation_time', 'content_type', 'object_id', 'comment_made_by_the_user', 'comment_made_by_the_id_pet_seeker', 'comment_made_by_the_id_pet_shelter', 'rating', 'is_application', 'name', 'is_reply', 'parent_comment', 'id', 'replies']

    def validate(self, data):
        content_type = data.get('content_type')
        object_id = data.get('object_id')
        if not ContentType.objects.filter(pk=content_type.id).exists():
            raise serializers.ValidationError("Not a valid content type to comment on.")
        return data

    def get_replies(self, obj):
        # Recursive call to serialize replies
        replies = CommentSerializer(obj.replies.all(), many=True).data
        return replies if replies else []  # Return an empty array if there are no replies
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['replies'] = ret.get('replies', [])
        return ret