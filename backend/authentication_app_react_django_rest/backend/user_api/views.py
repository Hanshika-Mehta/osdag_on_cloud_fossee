from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from .models import expenseItems , AppUser
import json


class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
    	
		serializer = UserRegisterSerializer(data=request.data)
		print(request)
		if serializer.is_valid(raise_exception=False):
			user = serializer.create(request.data)
			print(user)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		# user=AppUser()
		# if(AppUser.objects.get(email=request.data['email'])):
    	# 		user = AppUser.objects.get(email=request.data['email'])
				
		# else:
		# 	user = AppUser()
		# 	print("request========",request.data)
		# 	user.email = request.data["email"]
		# 	user.username = request.data['username']
		# 	user.password = request.data["password"]
		# 	user.save()
		# if user :
    	# 		return Response(json.dumps(user), status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)
		


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			print(user.id)
			login(request, user)
			# print(type(serializer.data))
			data_dict={"data":serializer.data,"user_id":user.id}
			return Response(data_dict, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		print(serializer.data)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)
	


class UserItems(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	##
	def get(self, request,pk):
		user = AppUser.objects.get(user_id=pk)
		try:

			user_items = expenseItems.objects.get(user_id=pk)

		except:
			user_items = expenseItems.objects.all()
		print(user_items)
		return Response({'user': "hello"}, status=status.HTTP_200_OK)


