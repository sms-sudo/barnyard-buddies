from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField
from .models import Blog


class BlogSerializer(serializers.ModelSerializer): #for detailed blog
    Blog = PrimaryKeyRelatedField(read_only=True)
    Blog = DateTimeField(read_only=True) #may cause bug
    class Meta:
        model = Blog
        fields = '__all__'

class UpdateSerializer(serializers.ModelSerializer): #too update likes
    class Meta:
        model = Blog
        fields = ['likes']
