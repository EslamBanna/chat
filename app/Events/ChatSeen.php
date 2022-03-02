<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatSeen implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $chatRoomId;
    public $s_user_id;
    public function __construct($chatRoomId, $s_user_id)
    {
        $this->chatRoomId = $chatRoomId;
        $this->s_user_id = $s_user_id;
    }

    public function broadcastOn()
    {
        return ['chat-room' . $this->s_user_id];
    }

    public function broadcastAs()
    {
        return 'chat-room-seen';
    }
}
