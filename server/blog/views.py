from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework import generics
from .models import Blog
from . serializer import BlogSerializer, UpdateSerializer
# from .serializer import 
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class BlogListCreateView(generics.ListCreateAPIView):
    pagination_class = [PageNumberPagination]
    authentication_classes = [JWTAuthentication]
    queryset = Blog.objects.all()
    filter_backends = [OrderingFilter]
    ordering_fields = ['date_posted', 'likes']
    serializer_class = BlogSerializer

    def get_permissions(self):
        # if self.request.method == 'GET':
        #     return []
        return [] 
    
    def get_queryset(self):
       return Blog.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    
    def list(self, request, *args, **kwargs):
            author_id = self.request.query_params.get('author', None)
            if author_id:
                queryset = Blog.objects.filter(author__id=author_id)
            else:
                queryset = self.get_queryset()

            queryset = self.filter_queryset(queryset)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class BlogUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = UpdateSerializer
    lookup_field = 'pk'
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        instance = serializer.instance
        user = self.request.user

        if instance.is_liked_by_user(user):
            print("unliking it")
            # User has already liked the post, so unlike it
            instance.likes -= 1
            instance.liked_by_users.remove(user)
        else:
            print("liking it")
            # User has not liked the post, so like it
            instance.likes += 1
            instance.liked_by_users.add(user)
        print("likes:", instance.likes)
        instance.save()
        print(user.id)

        return Response(serializer.data, status=status.HTTP_200_OK)
     

class BlogRetrieveView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    lookup_field = 'pk'