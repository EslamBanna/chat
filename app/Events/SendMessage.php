<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $message;
    public $chat_attach;
    public $chatRoomId;
    public $userID;
    public $user_name;
    public $user_image;
    public $sender;
    public $created_at;
    public function __construct($message, $chat_attach, $chatRoomId, $userID,$user_name,$user_image,$sender, $created_at)
    {
        $this->message = $message;
        $this->chat_attach = $chat_attach;
        $this->chatRoomId = $chatRoomId;
        $this->userID = $userID;
        $this->user_name = $user_name;
        $this->user_image = $user_image;
        $this->sender = $sender;
        $this->created_at = $created_at;
    }

    public function broadcastOn()
    {
        return ['chat' . $this->userID];
    }

    public function broadcastAs()
    {
        return 'message';
    }
}
