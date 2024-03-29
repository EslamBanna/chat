<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CreateNewChatRoom implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $userId;
    public $chat_room_data;
    public function __construct($userId,$chat_room_data)
    {
        $this->userId = $userId;
        $this->chat_room_data = $chat_room_data;
    }

    public function broadcastOn()
    {
        return ['chat-rooms' . $this->userId];
    }

    public function broadcastAs()
    {
        return 'create-chat-room';
    }
}
