import json
from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import random
import time
from django.views.decorators.csrf import csrf_exempt
from .models import RoomMember

def getToken(request):
    appId = '8decc7637e1140e084341fee6cea8bfc'
    appCertificate = '33b4d5ff3dfc428282e2081327d66258'
    
    # Retrieve channelName from the request
    channelName = request.GET.get('channel')
    
    # Check if channelName is None
    if not channelName:
        return JsonResponse({'error': 'Channel name is required'}, status=400)
    
    # Generate a random UID
    uid = random.randint(1, 230)
    
    # Set token expiration
    expirationTimeInSeconds = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs = int(currentTimeStamp) + expirationTimeInSeconds
    
    # Role for Agora
    role = 1
    
    try:
        # Generate the token
        token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    except Exception as e:
        # Log error and return a response
        return JsonResponse({'error': str(e)}, status=500)
    
    # Return token and uid as a JSON response
    return JsonResponse({'token': token, 'uid': uid}, safe=False)

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')

@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, created = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name':data['name']}, safe=False)

def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name':member.name}, safe=False)


@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)