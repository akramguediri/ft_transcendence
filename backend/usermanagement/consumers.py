# your_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'move_paddle':
            # Broadcast paddle movement to all players in the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_action',
                    'action': 'move_paddle',
                    'player': data['player'],
                    'y': data['y'],
                }
            )

    # Receive message from room group
    async def game_action(self, event):
        action = event['action']

        if action == 'move_paddle':
            # Send paddle movement to WebSocket
            await self.send(text_data=json.dumps({
                'action': 'move_paddle',
                'player': event['player'],
                'y': event['y'],
            }))